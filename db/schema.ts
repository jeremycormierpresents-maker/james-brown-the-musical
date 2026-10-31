import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const signups = sqliteTable("information_signups", { id: text("id").primaryKey(), firstName: text("first_name"), email: text("email").notNull().unique(), consentText: text("consent_text").notNull(), consentVersion: text("consent_version").notNull(), consentAt: text("consent_at").notNull(), createdAt: text("created_at").notNull() });
export const messages = sqliteTable("contact_messages", { id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull(), subject: text("subject").notNull(), message: text("message").notNull(), createdAt: text("created_at").notNull() });
export const rateLimits = sqliteTable("form_rate_limits", { key: text("key").primaryKey(), requests: integer("requests").notNull(), expiresAt: integer("expires_at").notNull() }, table => [index("rate_limits_expiry_idx").on(table.expiresAt)]);

export const auditions = sqliteTable("audition_submissions", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  city: text("city").notNull(),
  state: text("state"),
  country: text("country").notNull(),
  disciplines: text("disciplines", { mode: "json" }).$type<string[]>().notNull(),
  productions: text("productions", { mode: "json" }).$type<string[]>().notNull(),
  experience: text("experience"),
  videoUrl: text("video_url"),
  headshotKey: text("headshot_key").notNull(),
  headshotName: text("headshot_name").notNull(),
  headshotType: text("headshot_type").notNull(),
  headshotSize: integer("headshot_size").notNull(),
  resumeKey: text("resume_key").notNull(),
  resumeName: text("resume_name").notNull(),
  resumeType: text("resume_type").notNull(),
  resumeSize: integer("resume_size").notNull(),
  payloadHash: text("payload_hash").notNull(),
  consentText: text("consent_text").notNull(),
  consentVersion: text("consent_version").notNull(),
  consentAt: text("consent_at").notNull(),
  createdAt: text("created_at").notNull(),
}, table => [index("audition_created_at_idx").on(table.createdAt)]);
