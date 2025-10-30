"""
Article content scraper using BeautifulSoup and requests.
Extracts full article text from URLs when APIs provide truncated content.
"""

import requests
from bs4 import BeautifulSoup
import re
import logging

logger = logging.getLogger(__name__)

# Common article content selectors (ordered by priority)
ARTICLE_SELECTORS = [
    'article',
    '[role="article"]',
    '.article-body',
    '.article-content',
    '.post-content',
    '.entry-content',
    '.story-body',
    '.article__body',
    'main article',
    '.content-body',
    '[itemprop="articleBody"]',
]

# Tags to remove (ads, social media, navigation, etc.)
UNWANTED_TAGS = [
    'script', 'style', 'nav', 'header', 'footer', 'aside',
    'iframe', 'noscript', 'form', 'button', 'svg'
]

# Classes/IDs to remove (common ad/social patterns)
UNWANTED_PATTERNS = [
    'ad', 'advertisement', 'social', 'share', 'related', 'sidebar',
    'comments', 'newsletter', 'subscribe', 'promo', 'widget',
    'navigation', 'menu', 'footer', 'header', 'cookie'
]


def clean_text(text):
    """Clean extracted text by removing extra whitespace and noise."""
    if not text:
        return ""
    
    # Remove multiple spaces, tabs, newlines
    text = re.sub(r'\s+', ' ', text)
    
    # Remove common noise patterns
    text = re.sub(r'(Advertisement|ADVERTISEMENT|Sponsored|SPONSORED)', '', text)
    text = re.sub(r'(Read more|Continue reading|Click here)', '', text, flags=re.IGNORECASE)
    
    # Remove email addresses and URLs
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'http\S+', '', text)
    
    return text.strip()


def should_remove_element(element):
    """Check if an element should be removed based on class/id patterns."""
    if not element.name:
        return False
    
    # Check class and id attributes
    classes = element.get('class', [])
    elem_id = element.get('id', '')
    
    # Convert to lowercase strings for comparison
    text_to_check = ' '.join(str(c).lower() for c in classes) + ' ' + str(elem_id).lower()
    
    # Check against unwanted patterns
    for pattern in UNWANTED_PATTERNS:
        if pattern in text_to_check:
            return True
    
    return False


def extract_article_content(url, timeout=10):
    """
    Extract full article content from a URL.
    
    Args:
        url (str): Article URL
        timeout (int): Request timeout in seconds
        
    Returns:
        str: Extracted article content, or empty string if extraction fails
    """
    try:
        # Set a realistic user agent to avoid blocking
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        
        # Fetch the page
        response = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        response.raise_for_status()
        
        # Parse with BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove unwanted tags
        for tag in UNWANTED_TAGS:
            for element in soup.find_all(tag):
                element.decompose()
        
        # Remove unwanted elements by class/id patterns
        for element in soup.find_all():
            if should_remove_element(element):
                element.decompose()
        
        # Try to find article content using common selectors
        article_content = None
        for selector in ARTICLE_SELECTORS:
            article_content = soup.select_one(selector)
            if article_content:
                logger.debug(f"Found article content using selector: {selector}")
                break
        
        # Fallback: use main tag or body
        if not article_content:
            article_content = soup.find('main') or soup.find('body')
        
        if not article_content:
            logger.warning(f"Could not find article content for URL: {url}")
            return ""
        
        # Extract paragraphs
        paragraphs = article_content.find_all('p')
        
        if not paragraphs:
            # Fallback: get all text
            text = article_content.get_text(separator=' ', strip=True)
        else:
            # Join paragraph text
            text = ' '.join(p.get_text(separator=' ', strip=True) for p in paragraphs)
        
        # Clean the text
        cleaned_text = clean_text(text)
        
        # Validate: must have reasonable length (lowered threshold to 50 chars)
        if len(cleaned_text) < 50:
            logger.warning(f"Extracted content too short ({len(cleaned_text)} chars) for URL: {url}")
            return ""
        
        logger.info(f"Successfully extracted {len(cleaned_text)} characters from {url}")
        return cleaned_text
        
    except requests.Timeout:
        logger.error(f"Timeout while fetching URL: {url}")
        return ""
    except requests.RequestException as e:
        logger.error(f"Request error while fetching URL {url}: {str(e)}")
        return ""
    except Exception as e:
        logger.error(f"Unexpected error while scraping URL {url}: {str(e)}")
        return ""


def get_article_content(url, fallback_content="", title=""):
    """
    Get full article content from URL, with fallback to provided content.
    
    Args:
        url (str): Article URL
        fallback_content (str): Content to use if scraping fails
        title (str): Article title to use as last resort
        
    Returns:
        str: Article content (scraped or fallback)
    """
    # Clean fallback content (remove [+x chars] pattern)
    if fallback_content:
        fallback_content = re.sub(r'\s*\[\+\d+\s+chars\].*$', '', fallback_content).strip()
    
    # Try to scrape full content
    scraped_content = extract_article_content(url)
    
    if scraped_content:
        return scraped_content
    
    # Fallback to provided content (accept any length if we have it)
    if fallback_content and len(fallback_content) > 20:
        logger.info(f"Using fallback API content ({len(fallback_content)} chars) for URL: {url}")
        return fallback_content
    
    # Last resort: use title as content (better than nothing)
    if title and len(title) > 10:
        logger.info(f"Using title as content for URL: {url}")
        return title
    
    logger.warning(f"No content available for URL: {url}")
    return "Article content unavailable."
