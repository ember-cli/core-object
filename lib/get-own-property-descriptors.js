// Polyfill for Object.getOwnPropertyDescriptors based off TC-39's proposal
// Link: https://github.com/tc39/proposal-object-getownpropertydescriptors

if (!Object.hasOwnProperty('getOwnPropertyDescriptors')) {
  Object.defineProperty(
    Object,
    'getOwnPropertyDescriptors',
    {
      configurable: true,
      writable: true,
      value: function getOwnPropertyDescriptors(object) {
        return Object.keys(object).reduce(function(descriptors, key) {
          return Object.defineProperty(
            descriptors,
            key,
            {
              configurable: true,
              enumerable: true,
              writable: true,
              value: Object.getOwnPropertyDescriptor(object, key)
            }
          );
        }, {});
      }
    }
  );
}
