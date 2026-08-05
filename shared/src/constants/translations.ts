export const TRANSLATIONS = {
  am: {
    appTitle: 'ዜሮ ደላላ',
    tagline: 'ኮሚሽን የሌለው የቤትና መሬት ገበያ',
    categories: {
      residential: 'መኖሪያ ቤት',
      commercial: 'የንግድ ቦታ',
      land: 'መሬት'
    },
    listingTypes: {
      forSale: 'ለሽያጭ',
      forRent: 'ለኪራይ',
      lookingToBuy: 'እፈልጋለሁ (ለመግዛት)',
      lookingToRent: 'እፈልጋለሁ (ለመከራየት)'
    },
    nav: {
      home: 'ዋና ገጽ',
      search: 'ፈልግ',
      post: 'ለጥፍ',
      saved: 'የተቀመጡ',
      profile: 'መገለጫ'
    },
    actions: {
      searchProperties: 'ቤቶች ወይም መሬት ይፈልጉ...',
      filterByRegion: 'ክልል ይምረጡ',
      filterBySubcity: 'ክፍለ ከተማ ይምረጡ',
      viewDetails: 'ዝርዝር ይመልከቱ',
      contactOwner: 'ባለቤቱን ያግኙ',
      verifiedOwner: 'የተረጋገጠ ባለቤት'
    }
  },
  en: {
    appTitle: 'Zero Delala',
    tagline: 'Commission-free Real Estate Market',
    categories: {
      residential: 'Residential',
      commercial: 'Commercial',
      land: 'Land'
    },
    listingTypes: {
      forSale: 'For Sale',
      forRent: 'For Rent',
      lookingToBuy: 'Looking to Buy',
      lookingToRent: 'Looking to Rent'
    },
    nav: {
      home: 'Home',
      search: 'Search',
      post: 'Post',
      saved: 'Saved',
      profile: 'Profile'
    },
    actions: {
      searchProperties: 'Search properties or land...',
      filterByRegion: 'Select Region',
      filterBySubcity: 'Select Sub-City',
      viewDetails: 'View Details',
      contactOwner: 'Contact Owner',
      verifiedOwner: 'Verified Owner'
    }
  }
} as const;

export type TranslationKey = typeof TRANSLATIONS;
