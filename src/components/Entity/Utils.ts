import { isObject } from 'lodash';
import Immutable from 'seamless-immutable';

const mutator = (data) =>
  isObject(data) ? Immutable.asMutable(data || {}, { deep: true }) : data;

export default mutator;
