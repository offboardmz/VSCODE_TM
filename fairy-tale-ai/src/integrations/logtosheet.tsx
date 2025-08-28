"use server";

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "src/config/sunlit-mix-470107-p4-ff54258f59a0.json", // my JSON
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

const sheets = google.sheets({ version: "v4", auth });

export async function logToSheet(
  spreadsheetId: string,
  email: string,
  prompt: string,
  response: string
) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Logs!A:D", // Лист "Logs", колонки A-D
    valueInputOption: "RAW",
    requestBody: {
      values: [[email, prompt, response, new Date().toISOString()]],
    },
  });
}