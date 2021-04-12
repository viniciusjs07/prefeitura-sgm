module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": [],
    // Off = 0, Warn = 1, Error = 2
    "rules": {
        "no-const-assign": 2,
        "no-var": 2,
        "object-shorthand": 2,
        "no-array-constructor": 2,
        "array-callback-return": 2,
        "prefer-destructuring": ["error", {
            "array": false,
            "object": true
        }, {
            "enforceForRenamedProperties": false
        }],
        "func-style": 1,
        "no-loop-func": 2,
        "function-paren-newline": 2,
        "prefer-arrow-callback": 2,
        "arrow-spacing": 2,
        "arrow-parens": 2,
        "no-confusing-arrow": 2,
        "no-duplicate-imports": 2,
        "eqeqeq": 2,
        "no-nested-ternary": 2,
        "no-unneeded-ternary": 2,
        "nonblock-statement-body-position": 2,
        "brace-style": 2,
        "spaced-comment": 2,
        "space-before-blocks": 2,
        "keyword-spacing": 2,
        "space-infix-ops": 2,
        "no-multiple-empty-lines": 2,
        "space-in-parens": 2,
        "array-bracket-spacing": 2,
        "block-spacing": 2,
        "comma-style": 2,
        "id-length": 2
    },
    "overrides": [
        {
            "files": ["**.js"],
            "rules": {
                "no-const-assign": 0,
                "no-var": 0,
                "object-shorthand": 0,
                "no-array-constructor": 0,
                "array-callback-return": 0,
                "prefer-destructuring": 0,
                "func-style": 0,
                "no-loop-func": 0,
                "function-paren-newline": 0,
                "prefer-arrow-callback": 0,
                "arrow-spacing": 0,
                "arrow-parens": 0,
                "no-confusing-arrow": 0,
                "no-duplicate-imports": 0,
                "eqeqeq": 0,
                "no-nested-ternary": 0,
                "no-unneeded-ternary": 0,
                "nonblock-statement-body-position": 0,
                "brace-style": 0,
                "spaced-comment": 0,
                "indent": 0,
                "space-before-blocks": 0,
                "keyword-spacing": 0,
                "space-infix-ops": 0,
                "padded-blocks": 0,
                "no-multiple-empty-lines": 0,
                "space-in-parens": 0,
                "array-bracket-spacing": 0,
                "block-spacing": 0,
                "comma-style": 0,
                "id-length": 0
            },
        }
    ],
    "globals": {},
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "settings": {}
};