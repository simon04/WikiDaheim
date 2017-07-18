import mapboxApi from 'api/mapbox';
import wikiDaheimApi from 'api/wikidaheim';

export const AUTOCOMPLETE_ACTION_START = 'AUTOCOMPLETE_ACTION_START';
export const AUTOCOMPLETE_ACTION_ERROR = 'AUTOCOMPLETE_ACTION_ERROR';
export const AUTOCOMPLETE_ACTION_SUCCESS = 'AUTOCOMPLETE_ACTION_SUCCESS';

export const LOAD_CATEGORIES_ACTION_START = 'LOAD_CATEGORIES_ACTION_START';
export const LOAD_CATEGORIES_ACTION_ERROR = 'LOAD_CATEGORIES_ACTION_ERROR';
export const LOAD_CATEGORIES_ACTION_SUCCESS = 'LOAD_CATEGORIES_ACTION_SUCCESS';

export const PLACE_SELECT_ACTION_START = 'PLACE_SELECT_ACTION_START';
export const PLACE_SELECT_ACTION_ERROR = 'PLACE_SELECT_ACTION_ERROR';
export const PLACE_SELECT_ACTION_SUCCESS = 'PLACE_SELECT_ACTION_SUCCESS';

export const PLACE_TOGGLE_CATEGORY = 'PLACE_TOGGLE_CATEGORY';
export const PLACE_LOAD_CATEGORY_ACTION_START = 'PLACE_LOAD_CATEGORY_ACTION_START';
export const PLACE_LOAD_CATEGORY_ACTION_ERROR = 'PLACE_LOAD_CATEGORY_ACTION_ERROR';
export const PLACE_LOAD_CATEGORY_ACTION_SUCCESS = 'PLACE_LOAD_CATEGORY_ACTION_SUCCESS';

export const PLACE_ITEM_HOVER = 'PLACE_ITEM_HOVER';
export const PLACE_ITEM_LEAVE = 'PLACE_ITEM_LEAVE';

/*
  AUTOCOMPLETE ACTIONS
*/

function autocompleteActionStart(data) {
  return {
    type: AUTOCOMPLETE_ACTION_START,
    data,
  };
}

function autocompleteActionSuccess(data) {
  return {
    type: AUTOCOMPLETE_ACTION_SUCCESS,
    data,
  };
}

function autocompleteActionError(error) {
  return {
    type: AUTOCOMPLETE_ACTION_ERROR,
    error,
  };
}

let timeout = null;

export function autocomplete(query) {
  return function (dispatch) {
    dispatch(autocompleteActionStart(query));

    if (timeout) {
      clearTimeout(timeout);
    }

    // timeout to prevent a call to the API with every keystroke
    timeout = setTimeout(() => {
      mapboxApi.search(query)
        .then(data => dispatch(autocompleteActionSuccess(data)))
        .catch(error => dispatch(autocompleteActionError(error)));
    }, 300);
  };
}

/*
  LOAD CATEGORIES ACTIONS
*/

function loadCategoriesActionStart(data) {
  return {
    type: LOAD_CATEGORIES_ACTION_START,
    data,
  };
}

function loadCategoriesActionSuccess(data) {
  return {
    type: LOAD_CATEGORIES_ACTION_SUCCESS,
    data,
  };
}

function loadCategoriesActionError(error) {
  return {
    type: LOAD_CATEGORIES_ACTION_ERROR,
    error,
  };
}

export function loadCategories() {
  return function (dispatch) {
    dispatch(loadCategoriesActionStart());

    wikiDaheimApi.listCategories()
      .then(data => dispatch(loadCategoriesActionSuccess(data)))
      .catch(error => dispatch(loadCategoriesActionError(error)));
  };
}


/*
  PLACE SELECT ACTIONS
*/

function placeSelectActionStart(data) {
  return {
    type: PLACE_SELECT_ACTION_START,
    data,
  };
}

function placeSelectActionSuccess(data) {
  return {
    type: PLACE_SELECT_ACTION_SUCCESS,
    data,
  };
}

function placeSelectActionError(error) {
  return {
    type: PLACE_SELECT_ACTION_ERROR,
    error,
  };
}

export function selectPlace(place) {
  return function (dispatch, getState) {
    dispatch(placeSelectActionStart(place));

    const coordinates = place.get('geometry').get('coordinates');

    const selectedCats = getState().app.get('categories').filter((cat) => cat.get('show'));
    const mappedCats = selectedCats.toJS().map((cat) => cat.name);

    wikiDaheimApi.getTownData(coordinates.get(0), coordinates.get(1), mappedCats, true)
      .then(data => dispatch(placeSelectActionSuccess(data)))
      .catch(error => dispatch(placeSelectActionError(error)));
  };
}


/* TOGGLE CATEGORY */

function placeToggleCategory(data) {
  return {
    type: PLACE_TOGGLE_CATEGORY,
    data,
  };
}

function placeLoadCategoryActionStart(data) {
  return {
    type: PLACE_LOAD_CATEGORY_ACTION_START,
    data,
  };
}

function placeLoadCategoryActionSuccess(data) {
  return {
    type: PLACE_LOAD_CATEGORY_ACTION_SUCCESS,
    data,
  };
}

export function placeLoadCategoryActionError(error) {
  return {
    type: PLACE_LOAD_CATEGORY_ACTION_ERROR,
    error,
  };
}


export function toggleCategory(categoryName) {
  return function (dispatch, getState) {
    dispatch(placeToggleCategory(categoryName));

    const state = getState().app;
    const currentCategory = state.get('categories').find((category) =>
      category.get('name') === categoryName
    );

    // check if the category is already loaded
    if (state.get('placeSelected') && !currentCategory.get('loaded')) {
      dispatch(placeLoadCategoryActionStart(categoryName));

      const coordinates = state.get('placeMapData').get('geometry').get('coordinates');

      wikiDaheimApi.getTownData(coordinates.get(0), coordinates.get(1), [categoryName], false)
        .then(data => dispatch(placeLoadCategoryActionSuccess(data)))
        .catch(error => dispatch(placeLoadCategoryActionError(error)));
    }
  };
}


/* PLACE ITEM HOVER */
export function placeItemHover(data) {
  return {
    type: PLACE_ITEM_HOVER,
    data,
  };
}

export function placeItemLeave(error) {
  return {
    type: PLACE_ITEM_LEAVE,
    error,
  };
}
