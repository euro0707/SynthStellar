#!/usr/bin/env node
import fetch from "node-fetch";
import cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

function extractMainText(html) {
  const $ = cheerio.load(html);
  // Remove script and style tags
  $("script, style, noscript").remove();
  // Get visible text
  const text = $("body").text();
  // Collapse whitespace
  return text.replace(/\s+/g, " ").trim();
}

async function summarize(text, genAI) {
  const generationConfig = {
    temperature: 0.7,
    maxOutputTokens: 60,
    topK: 32,
    topP: 0.95,
  };

  const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });
  const prompt = `次の文章を1行で日本語で要約してください。\n文章:\n${text}`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: node summarize-url.js <URL>");
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Please set GEMINI_API_KEY environment variable.");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const html = await fetchHtml(url);
    const text = extractMainText(html);
    // Gemini context size is limited; truncate long text
    const truncated = text.slice(0, 8000);
    const summary = await summarize(truncated, genAI);
    console.log(summary);
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

main();
