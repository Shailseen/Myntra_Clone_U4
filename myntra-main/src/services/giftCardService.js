// This file contains functions for interacting with gift card API endpoints

// Mock data for gift cards (would be replaced with actual API calls in production)
const mockGiftCards = [
  {
    id: 1,
    name: "Myntra Gift Card",
    code: "MYNTRA500",
    value: 500,
    description: "Myntra exclusive gift card for fashion purchases",
    image: "https://constant.myntassets.com/pwa/assets/img/myntra-logo-small.png"
  },
  {
    id: 2,
    name: "Shopping Reward Card",
    code: "SHOP1000",
    value: 1000,
    description: "Special rewards for loyal customers",
    image: "https://constant.myntassets.com/pwa/assets/img/Gift-card.png"
  },
  {
    id: 3,
    name: "Premium Gift Voucher",
    code: "PREMIUM2000",
    value: 2000,
    description: "Premium shopping experience with extra savings",
    image: "https://constant.myntassets.com/pwa/assets/img/gift-card-premium.png"
  }
];

/**
 * Fetch all available gift cards
 * @returns {Promise<Array>} Array of gift card objects
 */
export const getGiftCards = async () => {
  // In a real application, this would be an API call like:
  // return await fetch('/api/gift-cards').then(res => res.json());
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGiftCards);
    }, 500);
  });
};

/**
 * Validate and apply a gift card by code
 * @param {string} code - The gift card code
 * @returns {Promise<Object>} The gift card object if valid
 */
export const validateGiftCard = async (code) => {
  // In a real application, this would be an API call like:
  // return await fetch(`/api/gift-cards/validate/${code}`).then(res => res.json());
  
  // Simulate API delay and validation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const card = mockGiftCards.find(
        card => card.code.toLowerCase() === code.toLowerCase()
      );
      
      if (card) {
        resolve(card);
      } else {
        reject(new Error('Invalid gift card code'));
      }
    }, 500);
  });
};

/**
 * Apply a gift card to the current order
 * @param {number} cardId - The gift card ID
 * @param {number} orderId - The order ID
 * @returns {Promise<Object>} The updated order information
 */
export const applyGiftCard = async (cardId, orderId) => {
  // Simulate API response
  return new Promise((resolve) => {
    setTimeout(() => {
      const card = mockGiftCards.find(card => card.id === cardId);
      resolve({
        success: true,
        message: `Gift card of ₹${card.value} applied successfully!`,
        appliedAmount: card.value
      });
    }, 300);
  });
};