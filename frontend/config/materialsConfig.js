// Materials Configuration - Easily scalable structure
// To add/remove categories or subcategories, simply modify this configuration

export const MATERIALS_CONFIG = {
  sarees: {
    id: 'sarees',
    name: 'Sarees',
    icon: '🥻',
    color: '#2d5016',
    gradient: 'linear-gradient(135deg, #2d5016 0%, #3e5622 100%)',
    description: 'Traditional and contemporary sarees in various fabrics',
    subcategories: {
      chiffon: {
        id: 'chiffon',
        name: 'Chiffon Sarees',
        icon: '🌸',
        color: '#db2777',
        gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
        description: 'Elegant chiffon sarees in various colors and patterns',
        folder: 'products/sarees/chiffon',
        hasIndividualPages: true // Each color/pattern gets its own page
      },
      'semi-silk': {
        id: 'semi-silk',
        name: 'Semi Silk Sarees',
        icon: '✨',
        color: '#b45309',
        gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
        description: 'Luxurious semi-silk sarees with rich textures',
        folder: 'products/sarees/semi-silk',
        hasIndividualPages: true
      },
      cotton: {
        id: 'cotton',
        name: 'Cotton Sarees',
        icon: '🌿',
        color: '#0f766e',
        gradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
        description: 'Comfortable and breathable cotton sarees',
        folder: 'products/sarees/cotton',
        hasIndividualPages: true
      },
      'mul-mul': {
        id: 'mul-mul',
        name: 'Mul Mul Sarees',
        icon: '🦋',
        color: '#7c2d92',
        gradient: 'linear-gradient(135deg, #7c2d92 0%, #a855f7 100%)',
        description: 'Soft and delicate mul mul sarees',
        folder: 'products/sarees/mul-mul',
        hasIndividualPages: true
      }
    }
  },
  chudidar: {
    id: 'chudidar',
    name: 'Chudidar Materials',
    icon: '👗',
    color: '#7c2d92',
    gradient: 'linear-gradient(135deg, #7c2d92 0%, #a855f7 100%)',
    description: 'Premium dress materials for chudidar and suits',
    folder: 'products/chudidar',
    showAllTogether: true, // Show all products together, expand to individual pages when more products
    subcategories: {} // Can add subcategories when needed
  }
}

// Helper functions for easy configuration management
export const getAllCategories = () => {
  return Object.values(MATERIALS_CONFIG)
}

export const getCategory = (categoryId) => {
  return MATERIALS_CONFIG[categoryId]
}

export const getCategorySubcategories = (categoryId) => {
  const category = MATERIALS_CONFIG[categoryId]
  return category ? Object.values(category.subcategories || {}) : []
}

export const getSubcategory = (categoryId, subcategoryId) => {
  const category = MATERIALS_CONFIG[categoryId]
  return category?.subcategories?.[subcategoryId]
}

export const getCategoryPath = (categoryId, subcategoryId = null) => {
  if (subcategoryId) {
    const subcategory = getSubcategory(categoryId, subcategoryId)
    return subcategory?.folder
  }
  const category = getCategory(categoryId)
  return category?.folder || `products/${categoryId}`
}

// Easy way to add new categories - just add to MATERIALS_CONFIG above
// Example of how to add a new category:
/*
  newCategory: {
    id: 'newCategory',
    name: 'New Category Name',
    icon: '🎭',
    color: '#hex-color',
    gradient: 'linear-gradient(...)',
    description: 'Description of the category',
    folder: 'products/newCategory',
    showAllTogether: true, // or false if you want subcategories
    subcategories: {
      // Add subcategories if needed
    }
  }
*/
