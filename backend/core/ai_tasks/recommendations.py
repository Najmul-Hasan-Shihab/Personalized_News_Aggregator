"""
ML-based recommendation engine for personalized news feed.
Uses TF-IDF for content similarity and collaborative filtering.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta
from collections import Counter
import numpy as np
import logging

logger = logging.getLogger(__name__)


class NewsRecommender:
    """
    Hybrid recommendation system combining:
    1. Content-based filtering (TF-IDF similarity)
    2. Collaborative filtering (user behavior patterns)
    3. Category preferences
    4. Recency boost
    5. Diversity enhancement
    """
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=1
        )
    
    def get_personalized_recommendations(
        self, 
        user_preferences, 
        reading_history, 
        all_articles,
        limit=50
    ):
        """
        Generate personalized article recommendations for a user.
        
        Args:
            user_preferences (dict): User's category preferences
            reading_history (list): User's reading history
            all_articles (list): All available articles
            limit (int): Number of recommendations to return
            
        Returns:
            list: Scored and ranked articles with recommendation reasons
        """
        try:
            if not all_articles:
                return []
            
            # Step 1: Filter out already read articles
            read_urls = {item['article_url'] for item in reading_history}
            candidate_articles = [
                article for article in all_articles 
                if article.get('url') not in read_urls
            ]
            
            if not candidate_articles:
                # If all articles have been read, return newest ones
                return sorted(
                    all_articles,
                    key=lambda x: x.get('publishedAt', ''),
                    reverse=True
                )[:limit]
            
            # Step 2: Score each article
            scored_articles = []
            
            for article in candidate_articles:
                score_breakdown = {
                    'category_score': 0,
                    'content_similarity_score': 0,
                    'recency_score': 0,
                    'popularity_score': 0
                }
                
                # Category matching score (0-40 points)
                category_score = self._calculate_category_score(
                    article, user_preferences
                )
                score_breakdown['category_score'] = category_score
                
                # Content similarity score (0-30 points)
                if reading_history:
                    content_score = self._calculate_content_similarity(
                        article, reading_history, all_articles
                    )
                    score_breakdown['content_similarity_score'] = content_score
                
                # Recency score (0-20 points)
                recency_score = self._calculate_recency_score(article)
                score_breakdown['recency_score'] = recency_score
                
                # Popularity/trending score (0-10 points)
                popularity_score = self._calculate_popularity_score(
                    article, reading_history
                )
                score_breakdown['popularity_score'] = popularity_score
                
                # Total score
                total_score = sum(score_breakdown.values())
                
                # Determine recommendation reason
                reason = self._get_recommendation_reason(
                    score_breakdown, article, user_preferences
                )
                
                scored_articles.append({
                    **article,
                    'recommendation_score': total_score,
                    'recommendation_reason': reason,
                    'score_breakdown': score_breakdown
                })
            
            # Step 3: Sort by score and apply diversity
            scored_articles.sort(
                key=lambda x: x['recommendation_score'], 
                reverse=True
            )
            
            # Step 4: Enhance diversity (avoid too many articles from same category)
            diverse_articles = self._enhance_diversity(scored_articles, limit)
            
            logger.info(f"✅ Generated {len(diverse_articles)} personalized recommendations")
            return diverse_articles
            
        except Exception as e:
            logger.error(f"❌ Error generating recommendations: {str(e)}")
            # Fallback to category-filtered articles
            return [a for a in all_articles if a.get('category') in user_preferences.get('categories', [])][:limit]
    
    def _calculate_category_score(self, article, user_preferences):
        """Calculate score based on category match."""
        categories = user_preferences.get('categories', [])
        article_category = article.get('category', '')
        
        if article_category in categories:
            # Primary interest category
            return 40
        return 0
    
    def _calculate_content_similarity(self, article, reading_history, all_articles):
        """Calculate content similarity with previously read articles."""
        try:
            # Get texts from reading history
            read_article_urls = [item['article_url'] for item in reading_history[:20]]  # Last 20 articles
            read_articles = [
                a for a in all_articles 
                if a.get('url') in read_article_urls
            ]
            
            if not read_articles:
                return 0
            
            # Prepare texts for TF-IDF
            read_texts = [
                f"{a.get('title', '')} {a.get('summary', '')}" 
                for a in read_articles
            ]
            current_text = f"{article.get('title', '')} {article.get('summary', '')}"
            
            if not current_text.strip():
                return 0
            
            # Calculate TF-IDF similarity
            all_texts = read_texts + [current_text]
            tfidf_matrix = self.vectorizer.fit_transform(all_texts)
            
            # Cosine similarity between current article and read articles
            similarities = cosine_similarity(
                tfidf_matrix[-1:],  # Current article
                tfidf_matrix[:-1]   # Read articles
            )[0]
            
            # Average similarity score, scaled to 0-30
            avg_similarity = np.mean(similarities)
            return float(avg_similarity * 30)
            
        except Exception as e:
            logger.warning(f"Content similarity calculation failed: {str(e)}")
            return 0
    
    def _calculate_recency_score(self, article):
        """Calculate score based on article recency."""
        try:
            published_at = article.get('publishedAt', '')
            if not published_at:
                return 0
            
            # Parse date
            if isinstance(published_at, str):
                pub_date = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
            else:
                pub_date = published_at
            
            # Calculate age in hours
            age_hours = (datetime.now(pub_date.tzinfo) - pub_date).total_seconds() / 3600
            
            # Score: newer articles get higher scores
            if age_hours < 6:
                return 20  # Very recent
            elif age_hours < 24:
                return 15  # Last day
            elif age_hours < 48:
                return 10  # Last 2 days
            elif age_hours < 168:  # 1 week
                return 5
            else:
                return 0
                
        except Exception as e:
            logger.warning(f"Recency calculation failed: {str(e)}")
            return 0
    
    def _calculate_popularity_score(self, article, reading_history):
        """Calculate score based on how many users have read similar articles."""
        try:
            # Count how many times articles in the same category were read
            category = article.get('category', '')
            category_reads = sum(
                1 for item in reading_history 
                if item.get('category') == category
            )
            
            # Scale to 0-10
            return min(category_reads * 2, 10)
            
        except Exception as e:
            logger.warning(f"Popularity calculation failed: {str(e)}")
            return 0
    
    def _get_recommendation_reason(self, score_breakdown, article, user_preferences):
        """Generate human-readable reason for recommendation."""
        reasons = []
        
        if score_breakdown['category_score'] > 0:
            category = article.get('category', '')
            reasons.append(f"Matches your interest in {category}")
        
        if score_breakdown['content_similarity_score'] > 15:
            reasons.append("Similar to articles you've read")
        
        if score_breakdown['recency_score'] >= 15:
            reasons.append("Breaking news")
        
        if score_breakdown['popularity_score'] > 5:
            reasons.append("Trending in your interests")
        
        if not reasons:
            return "Recommended for you"
        
        return " • ".join(reasons)
    
    def _enhance_diversity(self, scored_articles, limit):
        """
        Ensure diversity in recommendations by limiting consecutive articles
        from the same category.
        """
        if not scored_articles:
            return []
        
        diverse_list = []
        category_count = Counter()
        max_per_category = max(3, limit // 5)  # At most 20% from same category
        
        # First pass: add high-scoring articles with diversity constraint
        for article in scored_articles:
            category = article.get('category', 'general')
            
            if category_count[category] < max_per_category:
                diverse_list.append(article)
                category_count[category] += 1
                
                if len(diverse_list) >= limit:
                    break
        
        # Second pass: fill remaining slots if needed
        if len(diverse_list) < limit:
            for article in scored_articles:
                if article not in diverse_list:
                    diverse_list.append(article)
                    if len(diverse_list) >= limit:
                        break
        
        return diverse_list


# Singleton instance
recommender = NewsRecommender()


def get_recommendations(user_preferences, reading_history, all_articles, limit=50):
    """
    Convenience function to get personalized recommendations.
    
    Args:
        user_preferences (dict): User's category preferences
        reading_history (list): User's reading history
        all_articles (list): All available articles
        limit (int): Number of recommendations to return
        
    Returns:
        list: Personalized recommendations
    """
    return recommender.get_personalized_recommendations(
        user_preferences,
        reading_history,
        all_articles,
        limit
    )
