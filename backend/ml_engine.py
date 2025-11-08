"""
AI/ML Matching Engine
Uses content-based filtering with cosine similarity to match students with internships
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Optional


class InternshipMatchingEngine:
    """
    AI-based matching engine that calculates compatibility scores
    between students and internships using multiple factors.

    The engine supports a feedback-driven learning loop that adjusts the
    weights of the scoring components based on historical hiring outcomes
    and qualitative company feedback.
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        # Base weights mirror the original scoring logic so the contribution
        # from skills, location, sector, qualification and affirmative action
        # stays consistent with the pre-feedback implementation.
        self.base_weights = {
            'skill_score': 0.35,
            'location_score': 0.20,
            'sector_score': 0.25,
            'qualification_score': 0.15,
            'affirmative_bonus': 0.05,
        }
        self.current_weights = dict(self.base_weights)
        self.feedback_learning_rate = 0.35
        self.feature_maximums = {
            'skill_score': 100.0,
            'location_score': 100.0,
            'sector_score': 100.0,
            'qualification_score': 100.0,
            'affirmative_bonus': 20.0,
        }
        self.positive_statuses = {
            'shortlisted',
            'shortlist',
            'interview',
            'interviewed',
            'selected',
            'hired',
            'accepted',
        }
        self.negative_statuses = {'rejected', 'declined'}
        self._min_weight = 0.05

    def calculate_skill_match(self, student_skills: str, required_skills: str) -> float:
        """
        Calculate skill match using TF-IDF and cosine similarity.
        Returns score between 0-100.
        """
        if not student_skills or not required_skills:
            return 0.0

        try:
            skills = [student_skills.lower(), required_skills.lower()]
            tfidf_matrix = self.vectorizer.fit_transform(skills)
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return round(similarity * 100, 2)
        except Exception:
            return 0.0

    def calculate_location_match(self, student_location: str, internship_location: str) -> float:
        """
        Calculate location match (exact match or partial match).
        Returns score between 0-100.
        """
        if not student_location or not internship_location:
            return 50.0  # Neutral score

        student_loc = student_location.lower().strip()
        intern_loc = internship_location.lower().strip()

        if student_loc == intern_loc:
            return 100.0
        if student_loc in intern_loc or intern_loc in student_loc:
            return 70.0
        return 30.0

    def calculate_sector_match(self, preferred_sectors: str, internship_sector: str) -> float:
        """
        Calculate sector/industry match.
        Returns score between 0-100.
        """
        if not preferred_sectors or not internship_sector:
            return 50.0

        sectors = [s.strip().lower() for s in preferred_sectors.split(',')]
        intern_sector = internship_sector.lower().strip()

        if intern_sector in sectors:
            return 100.0
        return 40.0

    def calculate_qualification_match(self, student_qual: str, required_qual: str) -> float:
        """
        Calculate qualification match.
        Returns score between 0-100.
        """
        if not student_qual or not required_qual:
            return 50.0

        student_q = student_qual.lower().strip()
        required_q = required_qual.lower().strip()

        if student_q == required_q:
            return 100.0
        if student_q in required_q or required_q in student_q:
            return 80.0
        return 50.0

    def calculate_affirmative_bonus(
        self,
        is_rural: bool,
        is_aspirational: bool,
        social_category: str,
        past_participation: bool,
    ) -> float:
        """
        Calculate affirmative action bonus for diversity and inclusion.
        Returns bonus score between 0-20.
        """
        bonus = 0.0

        if is_rural:
            bonus += 5.0
        if is_aspirational:
            bonus += 5.0
        if social_category in ['SC', 'ST', 'OBC']:
            bonus += 5.0
        if not past_participation:
            bonus += 5.0

        return min(bonus, 20.0)

    def _infer_feedback_sentiment(self, status: Optional[str], feedback: Optional[str]) -> float:
        """
        Infer a coarse sentiment score from the pipeline status and optional
        textual feedback. Returns -1 for negative signals, 0 for neutral/unknown
        and +1 for positive signals.
        """
        if status:
            normalized_status = status.strip().lower()
            if normalized_status in self.positive_statuses:
                return 1.0
            if normalized_status in self.negative_statuses:
                return -1.0

        if not feedback:
            return 0.0

        text = feedback.lower()
        positive_hits = sum(
            token in text
            for token in [
                'great fit',
                'good fit',
                'progress',
                'strong',
                'excellent',
                'hire',
                'move forward',
                'keep in process',
            ]
        )
        negative_hits = sum(
            token in text
            for token in [
                'not a fit',
                'poor fit',
                'reject',
                'decline',
                'weak',
                'lacking',
                'overqualified',
                'underqualified',
            ]
        )

        if positive_hits == negative_hits:
            return 0.0
        return 1.0 if positive_hits > negative_hits else -1.0

    def update_weights_from_feedback(self, feedback_records: List[Dict]) -> None:
        """
        Update component weights using historical feedback. Features that
        frequently appear in positive matches gain influence, while features
        associated with negative outcomes lose weight. Weights are re-normalised
        to maintain a stable scoring range.
        """
        if not feedback_records:
            self.current_weights = dict(self.base_weights)
            return

        score_totals = {feature: 0.0 for feature in self.base_weights}
        feedback_count = 0

        for record in feedback_records:
            sentiment = self._infer_feedback_sentiment(
                record.get('status'),
                record.get('feedback'),
            )
            if sentiment == 0:
                continue

            feedback_count += 1
            for feature in score_totals:
                raw_value = float(record.get(feature, 0.0) or 0.0)
                max_value = self.feature_maximums[feature]
                if max_value <= 0:
                    continue
                normalised = np.clip(raw_value / max_value, -1.0, 1.0)
                score_totals[feature] += sentiment * normalised

        if feedback_count == 0:
            self.current_weights = dict(self.base_weights)
            return

        adjusted_weights = {}
        for feature, base_weight in self.base_weights.items():
            adjustment = score_totals[feature] / feedback_count
            raw_weight = base_weight * (1 + self.feedback_learning_rate * adjustment)
            min_weight = self._min_weight if feature != 'affirmative_bonus' else base_weight * 0.2
            adjusted_weights[feature] = max(raw_weight, min_weight)

        total = sum(adjusted_weights.values())
        if total <= 0:
            self.current_weights = dict(self.base_weights)
            return

        self.current_weights = {
            feature: weight / total for feature, weight in adjusted_weights.items()
        }

    def calculate_match_score(self, student: Dict, internship: Dict) -> Dict:
        """
        Calculate overall match score using a weighted algorithm.
        The weights are dynamically updated via feedback.
        """
        student_skill_profile = ", ".join(
            filter(None, [student.get('skills', ''), student.get('resume_skills', '')])
        )

        skill_score = self.calculate_skill_match(
            student_skill_profile,
            internship.get('required_skills', ''),
        )

        location_score = self.calculate_location_match(
            student.get('location', ''),
            internship.get('location', ''),
        )

        student_sectors = ", ".join(
            filter(
                None,
                [
                    student.get('preferred_sectors', ''),
                    student.get('resume_sector_insights', ''),
                ],
            )
        )

        sector_score = self.calculate_sector_match(
            student_sectors,
            internship.get('sector', ''),
        )

        qualification_score = self.calculate_qualification_match(
            student.get('qualification', ''),
            internship.get('qualification_required', ''),
        )

        affirmative_bonus = self.calculate_affirmative_bonus(
            student.get('is_rural', False),
            student.get('is_aspirational_district', False),
            student.get('social_category', 'General'),
            student.get('past_participation', False),
        )

        weights = self.current_weights
        # The total score calculation preserves the original weighting scheme
        # (35% skills, 20% location, 25% sector, 15% qualification, 5% bonus)
        # while still allowing the feedback loop to gently adjust the weights
        # when historical outcomes are available.
        total_score = (
            skill_score * weights['skill_score']
            + location_score * weights['location_score']
            + sector_score * weights['sector_score']
            + qualification_score * weights['qualification_score']
            + affirmative_bonus * weights['affirmative_bonus']
        )

        return {
            'match_score': round(total_score, 2),
            'skill_score': skill_score,
            'location_score': location_score,
            'sector_score': sector_score,
            'qualification_score': qualification_score,
            'affirmative_bonus': affirmative_bonus,
        }

    def find_best_matches(
        self,
        student: Dict,
        internships: List[Dict],
        feedback_records: Optional[List[Dict]] = None,
        top_n: int = 10,
    ) -> List[Dict]:
        """
        Find the top N best matching internships for a student.

        The matching criteria (skills, location, sector, qualification and
        affirmative bonus) remain unchanged; we simply refresh the internal
        weights with any feedback before applying the familiar scoring logic.
        """
        if feedback_records is None:
            feedback_records = []

        self.update_weights_from_feedback(feedback_records)

        matches = []
        for internship in internships:
            scores = self.calculate_match_score(student, internship)
            matches.append(
                {
                    'internship_id': internship['id'],
                    'internship': internship,
                    **scores,
                }
            )

        matches.sort(key=lambda x: x['match_score'], reverse=True)
        return matches[:top_n]

