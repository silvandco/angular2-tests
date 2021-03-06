var commonJSExports = require('../lib/zone');
// WARNING: Browserify tests currently don't patch Jasmine's `it` and `fit` functions.
//          Writing any async tests in this file will result in zone leakage.
//          See `jasmine-patch.js` for a hint of what needs to be done here.
describe('Zone in CommonJS environment', function () {
    it('defines proper exports properties in CommonJS environment', function () {
        expect(commonJSExports.Zone).toBeDefined();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvY29tbW9uanMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFZLGVBQWUsV0FBTSxhQUFhLENBQUMsQ0FBQTtBQUUvQyxzRkFBc0Y7QUFDdEYsNkVBQTZFO0FBQzdFLDRFQUE0RTtBQUc1RSxRQUFRLENBQUMsOEJBQThCLEVBQUU7SUFDdkMsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO1FBQzlELE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvbW1vbkpTRXhwb3J0cyBmcm9tICcuLi9saWIvem9uZSc7XG5cbi8vIFdBUk5JTkc6IEJyb3dzZXJpZnkgdGVzdHMgY3VycmVudGx5IGRvbid0IHBhdGNoIEphc21pbmUncyBgaXRgIGFuZCBgZml0YCBmdW5jdGlvbnMuXG4vLyAgICAgICAgICBXcml0aW5nIGFueSBhc3luYyB0ZXN0cyBpbiB0aGlzIGZpbGUgd2lsbCByZXN1bHQgaW4gem9uZSBsZWFrYWdlLlxuLy8gICAgICAgICAgU2VlIGBqYXNtaW5lLXBhdGNoLmpzYCBmb3IgYSBoaW50IG9mIHdoYXQgbmVlZHMgdG8gYmUgZG9uZSBoZXJlLlxuXG5cbmRlc2NyaWJlKCdab25lIGluIENvbW1vbkpTIGVudmlyb25tZW50JywgZnVuY3Rpb24gKCkge1xuICBpdCgnZGVmaW5lcyBwcm9wZXIgZXhwb3J0cyBwcm9wZXJ0aWVzIGluIENvbW1vbkpTIGVudmlyb25tZW50JywgZnVuY3Rpb24gKCkge1xuICAgIGV4cGVjdChjb21tb25KU0V4cG9ydHMuWm9uZSkudG9CZURlZmluZWQoKTtcbiAgfSk7XG59KTtcbiJdfQ==