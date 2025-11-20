import { notFound } from "next/navigation";

// This catch-all route handles all unmatched routes (with at least one segment) and shows our custom 404 page
export default function CatchAll() {
  notFound();
}

// Ensure this route is dynamic
export const dynamic = 'force-dynamic';

