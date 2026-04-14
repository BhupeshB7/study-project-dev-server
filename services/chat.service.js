import { ChatFaqModel } from "../models/chatFaq.model.js";
import { CHAT_PERMISSIONS } from "../constants/permission.js";
import { canUser } from "../utils/rbac.util.js";
import logger from "../utils/logger.js";

const chatLogger = logger.namespaceLogger("CHAT");

// Deterministic keyword-based matching
const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

const scoreMatch = (queryTokens, faq) => {
  let score = 0;
  const faqKeywords = faq.keywords.map((k) => k.toLowerCase());
  const questionTokens = tokenize(faq.question);

  for (const token of queryTokens) {
    if (faqKeywords.includes(token)) score += 3;
    if (questionTokens.includes(token)) score += 2;
  }

  return score;
};

export const askQuestion = async (question, user) => {
  const queryTokens = tokenize(question);

  if (queryTokens.length === 0) {
    return {
      answer:
        "Could you please rephrase your question? I need more details to help you.",
      confidence: 0,
      faqs: [],
    };
  }

  // First try text search
  let faqs = await ChatFaqModel.find({
    instituteId: user.instituteId,
    isActive: true,
    $text: { $search: question },
  })
    .limit(10)
    .lean();

  // Fallback to keyword matching if text search yields nothing
  if (faqs.length === 0) {
    faqs = await ChatFaqModel.find({
      instituteId: user.instituteId,
      isActive: true,
      keywords: { $in: queryTokens },
    })
      .limit(10)
      .lean();
  }

  if (faqs.length === 0) {
    return {
      answer:
        "I'm sorry, I couldn't find an answer to your question. Please contact the administrative office for assistance.",
      confidence: 0,
      faqs: [],
    };
  }

  // Score and rank
  const scored = faqs
    .map((faq) => ({ ...faq, score: scoreMatch(queryTokens, faq) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const confidence = Math.min(best.score / (queryTokens.length * 3), 1);

  // Increment helpful count for the best match
  await ChatFaqModel.findByIdAndUpdate(best._id, {
    $inc: { helpfulCount: 1 },
  });

  chatLogger.info(`Chat query: "${question}" -> matched FAQ: ${best._id}`);

  return {
    answer: best.answer,
    confidence: Math.round(confidence * 100),
    matchedQuestion: best.question,
    category: best.category,
    relatedFaqs: scored.slice(1, 4).map((f) => ({
      id: f._id,
      question: f.question,
      category: f.category,
    })),
  };
};

export const listFaqCategories = async (instituteId) => {
  const categories = await ChatFaqModel.distinct("category", {
    instituteId,
    isActive: true,
  });
  return categories;
};

export const listFaqsByCategory = async (category, instituteId) => {
  return ChatFaqModel.find({
    instituteId,
    category,
    isActive: true,
  })
    .select("question answer category")
    .sort({ helpfulCount: -1 });
};

// --- FAQ Management (Admin/Staff) ---

export const createFaq = async (payload, user) => {
  if (!canUser(user, CHAT_PERMISSIONS.CHAT_MANAGE_FAQ)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const faq = await ChatFaqModel.create({
    ...payload,
    instituteId: user.instituteId,
    createdBy: user._id,
  });

  chatLogger.info(`FAQ created: ${faq._id}`);
  return faq;
};

export const updateFaq = async (id, payload, user) => {
  if (!canUser(user, CHAT_PERMISSIONS.CHAT_MANAGE_FAQ)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const faq = await ChatFaqModel.findOneAndUpdate(
    { _id: id, instituteId: user.instituteId },
    payload,
    { new: true, runValidators: true },
  );

  if (!faq) {
    throw Object.assign(new Error("FAQ not found"), { statusCode: 404 });
  }

  return faq;
};

export const deleteFaq = async (id, user) => {
  if (!canUser(user, CHAT_PERMISSIONS.CHAT_MANAGE_FAQ)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const faq = await ChatFaqModel.findOneAndDelete({
    _id: id,
    instituteId: user.instituteId,
  });

  if (!faq) {
    throw Object.assign(new Error("FAQ not found"), { statusCode: 404 });
  }

  chatLogger.info(`FAQ deleted: ${id}`);
  return true;
};

export const listFaqs = async (query, user) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { instituteId: user.instituteId };
  if (query.category) filter.category = query.category;
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";

  const [items, total] = await Promise.all([
    ChatFaqModel.find(filter)
      .sort({ helpfulCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "fullName email"),
    ChatFaqModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};
