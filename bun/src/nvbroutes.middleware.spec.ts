import { describe, expect, test } from "bun:test";
import { extractPathParam, isRouteMatch } from "./nvbroutes.middleware";

describe('extractPathParam', () => {
    test('should extract path parameters from the template', () => {
        const inputString1 = '/hello/hung';
        const templateString1 = '/hello/:id';

        const result1 = extractPathParam(inputString1, templateString1);

        expect(result1).toEqual(['hung']);

        const inputString2 = '/original/1123/haha/1445';
        const templateString2 = '/original/:firstId/haha/:secondId';

        const result2 = extractPathParam(inputString2, templateString2);

        expect(result2).toEqual(['1123', '1445']);
    });
});

describe('isRouteMatch', () => {
    test('should return true when the value matches the template', () => {
        const value1 = '/hello/hung';
        const template1 = '/hello/:id';
        expect(isRouteMatch(value1, template1)).toBe(true);

        const value2 = '/original/1123/haha/1445';
        const template2 = '/original/:firstId/haha/:secondId';
        expect(isRouteMatch(value2, template2)).toBe(true);
    });

    test('should return true when the value matches the template (ignore trailing splash)', () => {
        const value1 = '/hello/hung/';
        const template1 = '/hello/:id';
        expect(isRouteMatch(value1, template1)).toBe(true);

        const value2 = '/original/1123/haha/1445/';
        const template2 = '/original/:firstId/haha/:secondId';
        expect(isRouteMatch(value2, template2)).toBe(true);
    });

    test('should return false when the value does not match the template', () => {
        const value1 = '/hello/world/asdf';
        const template1 = '/hello/:id';
        expect(isRouteMatch(value1, template1)).toBe(false);

        const value2 = '/original/1123/haha/1445';
        const template2 = '/original/:firstId/haha/:secondId/:extra';
        expect(isRouteMatch(value2, template2)).toBe(false);

        const value3 = '/test';
        const template3 = '/test/:id';
        expect(isRouteMatch(value3, template3)).toBe(false);
    });
});