import re
from typing import Dict, Any, List

class QueryParser:
    BRANDS = ["nike", "puma", "adidas", "bata", "campus", "skechers", "reebok", "woodland", "asics", "fila", "under armour", "u.s. polo", "zara", "clarks", "hrx"]
    COLORS = ["black", "white", "red", "blue", "green", "grey", "navy", "brown", "pink", "yellow", "orange", "maroon", "beige", "olive", "off-white", "silver", "gold"]
    GENDER_MAP = {
        "men": "male", "man": "male", "male": "male", "boys": "male",
        "women": "female", "woman": "female", "female": "female", "girls": "female",
        "unisex": "unisex", "kids": "kids"
    }
    OCCASIONS = ["adventure", "basketball", "business", "casual", "college", "daily", "daily wear", "ethnic", "evening", "festive", "fitness", "formal", "formal casual", "function", "gym", "hiking", "meetings", "mountain", "night-out", "office", "office casual", "outdoor", "outing", "party", "reception", "running", "sports", "streetwear", "summer", "traditional", "trail running", "training", "travel", "trekking", "walking", "wedding", "workout"]
    STOP_WORDS = {"show", "me", "find", "please", "want", "buy", "looking", "for", "pair", "shoes", "with", "in", "a", "an", "the", "and", "or"}
    POPULAR_WORDS = {"popular", "trending", "best", "top", "recommended", "best seller", "most selling"}
    
    PRICE_MAX_WORDS = ["under", "below", "less than", "upto", "within", "max"]
    PRICE_MIN_WORDS = ["above", "over", "more than", "starting", "min", "atleast"]

    @staticmethod
    def _normalize_price(val: str) -> int:
        """Converts '5k' to 5000 and '1,000' to 1000."""
        val = val.lower().replace(",", "").replace(" ", "").strip()
        try:
            if "k" in val:
                return int(float(val.replace("k", "")) * 1000)
            return int(float(val))
        except (ValueError, TypeError):
            return 0

    @staticmethod
    def parse(text: str) -> Dict[str, Any]:
        original_text = text
        text = text.lower()
        
        filters = {
            "min_price": None,
            "max_price": None,
            "brands": [],
            "colors": [],
            "genders": [],
            "sizes": [],
            "occasions": [],
            "is_popular_intent": False
        }

        # --- 1. HANDLE POPULARITY ---
        for w in QueryParser.POPULAR_WORDS:
            if w in text:
                filters["is_popular_intent"] = True

        # --- 2. HANDLE PRICE RANGES (e.g., "500 to 1000" or "between 5k and 7k") ---
        # Pattern for "500 to 1000" or "5k - 7k"
        range_match = re.search(r'(\d+(?:\.\d+)?k?)\s*(?:to|and|-)\s*(\d+(?:\.\d+)?k?)', text)
        if range_match:
            filters["min_price"] = QueryParser._normalize_price(range_match.group(1))
            filters["max_price"] = QueryParser._normalize_price(range_match.group(2))
            # Remove the range from text so it doesn't interfere with keywords
            text = text.replace(range_match.group(0), " ")

        # --- 3. HANDLE SINGLE PRICE LIMITS (Under/Above) ---
        if filters["max_price"] is None:
            for w in QueryParser.PRICE_MAX_WORDS:
                m = re.search(rf'{w}\s*(\d+(?:\.\d+)?k?)', text)
                if m: 
                    filters["max_price"] = QueryParser._normalize_price(m.group(1))
                    text = text.replace(m.group(0), " ")
        
        if filters["min_price"] is None:
            for w in QueryParser.PRICE_MIN_WORDS:
                m = re.search(rf'{w}\s*(\d+(?:\.\d+)?k?)', text)
                if m: 
                    filters["min_price"] = QueryParser._normalize_price(m.group(1))
                    text = text.replace(m.group(0), " ")

        # --- 4. EXTRACT ENTITIES (Brands, Colors, Occasions, Gender) ---
        for brand in QueryParser.BRANDS:
            if re.search(rf'\b{re.escape(brand)}\b', text):
                filters["brands"].append(brand)
                text = text.replace(brand, " ")
        
        for color in QueryParser.COLORS:
            if re.search(rf'\b{re.escape(color)}\b', text):
                filters["colors"].append(color)
                text = text.replace(color, " ")

        for occ in QueryParser.OCCASIONS:
            if re.search(rf'\b{re.escape(occ)}\b', text):
                filters["occasions"].append(occ)
                text = text.replace(occ, " ")

        for k, v in QueryParser.GENDER_MAP.items():
            if re.search(rf'\b{re.escape(k)}\b', text):
                if v not in filters["genders"]:
                    filters["genders"].append(v)
                text = text.replace(k, " ")

        # --- 5. SIZES (Look for numbers 3-15 usually following 'size') ---
        size_matches = re.findall(r'(?:size|uk|us)?\s*\b(\d{1,2})\b', text)
        for s in size_matches:
            val = int(s)
            if 3 <= val <= 16:
                filters["sizes"].append(str(val))
                text = text.replace(s, " ")

        # --- 6. KEYWORDS (The leftover words) ---
        # Remove special characters
        clean_text = re.sub(r'[^a-z0-9\s]', ' ', text)
        words = clean_text.split()
        keywords = [w for w in words if w not in QueryParser.STOP_WORDS and len(w) > 2]

        return {
            "keywords": keywords,
            "filters": filters,
            "original": original_text
        }

def parse(query_text: str) -> dict:
    """Wrapper for QueryParser.parse"""
    return QueryParser.parse(query_text)
