"""Utility helpers for extracting and analysing resume content."""

from __future__ import annotations

import io
import re
from typing import Dict, Iterable, List, Sequence, Tuple

from PyPDF2 import PdfReader

try:  # pragma: no cover - optional dependency safety
    from docx import Document  # type: ignore
except ImportError:  # pragma: no cover
    Document = None  # type: ignore

# Curated list of common technical and business skills that we can
# reasonably expect to locate inside undergraduate resumes. The list is not
# exhaustive, but it gives the matching engine additional structured data to
# work with even when students provide free-form skills in the UI.
COMMON_SKILL_KEYWORDS: Tuple[str, ...] = (
    "python",
    "java",
    "javascript",
    "typescript",
    "c++",
    "c#",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "react",
    "node.js",
    "django",
    "flask",
    "machine learning",
    "deep learning",
    "data analysis",
    "power bi",
    "tableau",
    "excel",
    "communication",
    "teamwork",
    "problem solving",
    "leadership",
    "project management",
    "cloud",
    "aws",
    "azure",
    "gcp",
    "devops",
    "docker",
    "kubernetes",
    "html",
    "css",
    "figma",
    "ui/ux",
    "marketing",
    "sales",
    "financial analysis",
    "accounting",
)

# Map industry sectors to a handful of indicative keywords. When these
# keywords are found in the resume text we add the sector to the student's
# preferred sectors list so the matching engine can prioritise internships in
# the relevant domains.
SECTOR_KEYWORDS: Dict[str, Tuple[str, ...]] = {
    "Information Technology": (
        "software",
        "development",
        "programming",
        "technology",
        "it services",
    ),
    "Finance": (
        "finance",
        "investment",
        "banking",
        "equity",
        "financial analysis",
    ),
    "Marketing": (
        "marketing",
        "digital marketing",
        "seo",
        "social media",
        "branding",
    ),
    "Human Resources": (
        "talent",
        "recruitment",
        "human resources",
        "hr",
        "people management",
    ),
    "Operations": (
        "operations",
        "supply chain",
        "logistics",
        "process improvement",
    ),
    "Data Science": (
        "data science",
        "machine learning",
        "analytics",
        "statistics",
    ),
}


def _normalise_list(values: Iterable[str]) -> List[str]:
    """Normalise and deduplicate values while preserving order."""

    seen = set()
    normalised: List[str] = []

    for value in values:
        cleaned = value.strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        # Keep the original capitalisation when possible, otherwise title case.
        normalised.append(cleaned if any(c.isupper() for c in cleaned) else cleaned.title())

    return normalised


def extract_text_from_resume(file_bytes: bytes, filename: str) -> str:
    """Extract textual content from a resume file.

    Supports PDF, DOCX and plain text files. For unknown formats we make a
    best-effort attempt by decoding the bytes as UTF-8.
    """

    extension = (filename.rsplit(".", 1)[-1] if "." in filename else "").lower()
    text = ""

    if extension == "pdf":
        reader = PdfReader(io.BytesIO(file_bytes))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
    elif extension in {"docx"}:
        if Document is None:
            raise RuntimeError("python-docx dependency is missing")
        document = Document(io.BytesIO(file_bytes))
        text = "\n".join(paragraph.text for paragraph in document.paragraphs)
    else:
        # Attempt to decode as UTF-8 text.
        text = file_bytes.decode("utf-8", errors="ignore")

    return text.strip()


def analyse_resume_text(text: str) -> Dict[str, List[str]]:
    """Analyse resume text and infer structured insights."""

    lowered = text.lower()

    # Identify skill keywords by searching for word boundaries.
    skills = [
        keyword
        for keyword in COMMON_SKILL_KEYWORDS
        if re.search(r"\b" + re.escape(keyword) + r"\b", lowered)
    ]

    # Identify relevant sectors.
    sectors: List[str] = []
    for sector, keywords in SECTOR_KEYWORDS.items():
        if any(re.search(r"\b" + re.escape(keyword) + r"\b", lowered) for keyword in keywords):
            sectors.append(sector)

    return {
        "skills": _normalise_list(skills),
        "sectors": _normalise_list(sectors),
    }



def merge_comma_separated(base: str, additions: Sequence[str]) -> str:
    """Merge comma separated strings with an iterable of new values."""

    base_items = [item.strip() for item in (base or "").split(",") if item.strip()]
    merged = _normalise_list(list(base_items) + list(additions))
    return ", ".join(merged)


def build_resume_summary(skills: Sequence[str], sectors: Sequence[str]) -> str:
    """Create a short, human readable summary of resume insights."""

    parts: List[str] = []
    if skills:
        parts.append("Detected skills: " + ", ".join(skills) + ".")
    if sectors:
        parts.append("Potential sectors of interest: " + ", ".join(sectors) + ".")

    if not parts:
        return "Resume processed successfully."

    return " ".join(parts)

