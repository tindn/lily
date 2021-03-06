import {
  archiveCategory,
  createCategory,
  editCategory,
  getAllCategories,
  unarchiveCategory,
} from '../../db/categories';

export function loadCategoriesFromDbToRedux() {
  return function(dispatch) {
    getAllCategories().then(function(categories) {
      dispatch({ type: 'UPDATE_CATEGORIES', payload: categories });
    });
  };
}

export function addCategoryToDb(newCategory) {
  return function(dispatch) {
    return createCategory(newCategory).then(function() {
      return dispatch(loadCategoriesFromDbToRedux());
    });
  };
}

export function saveCategoryToDb(oldCategory, newCategory) {
  return function(dispatch) {
    return editCategory(oldCategory, newCategory).then(function() {
      return dispatch(loadCategoriesFromDbToRedux());
    });
  };
}

export function archiveCategoryToDb(name) {
  return function(dispatch) {
    return archiveCategory(name).then(function() {
      return dispatch(loadCategoriesFromDbToRedux());
    });
  };
}

export function unarchiveCategoryToDb(name) {
  return function(dispatch) {
    return unarchiveCategory(name).then(function() {
      return dispatch(loadCategoriesFromDbToRedux());
    });
  };
}
