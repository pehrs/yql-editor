
import monaco from "monaco-editor"
import { yqlReqValidate } from "./yql.req.schema";
import { yqlValidate } from "./yql.schema";

// Set MonacoTheme
// const parseTmTheme = require('monaco-themes').parseTmTheme;


// const path = require('path');
// const APP_DIR = path.resolve(__dirname, './src');
// const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

export const YQL_DOC_TYPE = "yql-req";

const rulesSample = {
    "off": true,
    "rulebase": "",
    "rules": 0
};

const rankingSample = {
    "location": "",
    "features": {
        "featureName": ""
    },
    "listFeatures": false,
    "profile": "default",
    "properties": {
        "propertyName": "value"
    },
    "softtimeout": {
        "enable": true,
        "factor": 0.7,
    },
    "sorting": "",
    "freshness": "",
    "queryCache": false,
    "rerankCount": 0,
    "keepRankCount": 0,
    "rankScoreDropLimit": 0,
    "globalPhase": {
        "rerankCount": 0
    }
};

const traceSample = {
    "level": 0,
    "explainLevel": 0,
    "profileDepth": 0,
    "timestamps": false,
    "query": true,
    "profiling": {
        "matching": {
            "depth": 0
        },
        "firstPhaseRanking": {
            "depth": 0
        },
        "secondPhaseRanking": {
            "depth": 0
        }
    }
};

const yqlReqSamples = [
    "\"yql\": \"select\"",
    "\"hits\": 0",
    "\"offset\": 0",
    "\"queryProfile\": \"default\"",
    "\"groupingSessionCache\": true",
    "\"searchChain\": \"default\"",
    "\"user\": \"\"",
    "\"recall\": \"\"",
    "\"hitcountestimate\": false",
    "\"noCache\": false",
    "\"timeout\": \"0.5s\"",
    "\"weakAnd\": {\"replace\": false}",
    "\"wand\": {\"wand\": 100}",
    "\"sorting\": {\"degrading\": true}",
    "\"metrics\": {\"ignore\": false}",
    `"rules": ${JSON.stringify(rulesSample, null, 2)}`,
    `"ranking": ${JSON.stringify(rankingSample, null, 2)}`,
    `"trace": ${JSON.stringify(traceSample, null, 2)}`
];

let keywords = ["true", "false"];

let yqlRequestProperties = [
    "input",
    "depth",
    "enable",
    "explainLevel",
    "factor",
    "featureName",
    "features",
    "firstPhaseRanking",
    "freshness",
    "globalPhase",
    "groupingSessionCache",
    "hitcountestimate",
    "hits",
    "keepRankCount",
    "level",
    "listFeatures",
    "location",
    "matching",
    "metrics",
    "noCache",
    "off",
    "offset",
    "profile",
    "profileDepth",
    "profiling",
    "properties",
    "propertyName",
    "query",
    "queryCache",
    "queryProfile",
    "rankScoreDropLimit",
    "ranking",
    "recall",
    "rerankCount",
    "rulebase",
    "rules",
    "searchChain",
    "secondPhaseRanking",
    "softtimeout",
    "sorting",
    "timeout",
    "timestamps",
    "trace",
    "user",
    "wand",
    "weakAnd",
    "yql",
];

// ===============
// YQL Keywords
// ===============
const basicKeywords = [
    "select",
    "from",
    "where",
    "order by",
    "limit",
    "offset",
    "timeout",
];

const whereKeywords = [
    "nearestNeighbor",
    "weightedSet",
    "predicate",
    "dotProduct",
    "userQuery",
    "nonEmpty",
    "userInput",
    "geoLocation",
    "sameElement",
    "matches",
    "range",
    "contains",
    "weakAnd",
    "phrase",
    "fuzzy",
    "equiv",
    "onear",
    "wand",
    "true",
    "false",
    "rank",
    "near",
    "and",
    "not",
    "uri",
    "or",
];

const annotationKeywords = [
    "accentDrop",
    "allowEmpty",
    "andSegmenting",
    "annotations",
    "approximate",
    "ascending",
    "bounds",
    "connectivity",
    "descending",
    "defaultIndex",
    "distance",
    "distanceThreshold",
    "endAnchor",
    "filter",
    "function",
    "grammar",
    "hitLimit",
    "hnsw.exploreAdditionalHits",
    "id",
    "implicitTransforms",
    "label",
    "language",
    "locale",
    "maxEditDistance",
    "nfkc",
    "normalizeCase",
    "origin",
    "prefix",
    "substring",
    "prefixLength",
    "ranked",
    "scoreThreshold",
    "significance",
    "startAnchor",
    "stem",
    "strength",
    "suffix",
    "targetHits",
    "usePositionData",
    "weight",
];

const yqlKeywords = basicKeywords.concat(whereKeywords);
//
// END: YQL Keywords

// const yqlRequestPropertyRegex = new RegExp(yqlRequestProperties.map(propertyName => `\\\"${propertyName}\\\"`).join("|"))

const yqlRequestPropertyKeywords = yqlRequestProperties.map(propertyName => `\"${propertyName}\"`)

class State {
    value = "";
    constructor(v) {
        this.value = v
    }
    clone() {
        return new State(this.value);
    }
    equals() {
        return true;
    }
}

function tokenizeYql(yql, offset) {

    let tokens = []

    if (yql === undefined || yql.length === 0) {
        return tokens;
    }

    if (yql.indexOf("select") == 0) {
        tokens.push({
            startIndex: offset,
            scopes: "keyword"
        })
        tokens.push({
            startIndex: 6 + offset,
            scopes: "white"
        })
    }

    // Color columns
    const yqlColumnsRegEx = /.*select (.*) from.*/
    const colMatch = yql.match(yqlColumnsRegEx);
    if (colMatch) {
        console.log("colMatch", colMatch[1]);
        const colMatchStr = colMatch[1]
        const kIndex = yql.indexOf(colMatchStr)
        if (kIndex != -1) {
            tokens.push({
                startIndex: kIndex + offset,
                scopes: "variable"
            })
            tokens.push({
                startIndex: kIndex + colMatchStr.length + offset,
                scopes: "white"
            })
        }
    }

    const yqlIndicesRegEx = /.*from (.*) where.*/
    const indicesMatch = yql.match(yqlIndicesRegEx);
    if (indicesMatch) {
        console.log("indicesMatch", indicesMatch[1]);
        const indicesMatchStr = indicesMatch[1]
        const kIndex = yql.indexOf(indicesMatchStr)
        if (kIndex != -1) {
            tokens.push({
                startIndex: kIndex + offset,
                scopes: "constant"
            })
            tokens.push({
                startIndex: kIndex + indicesMatchStr.length + offset,
                scopes: "white"
            })
        }
    }


    for (const keywordI in yqlKeywords) {
        const keyword = yqlKeywords[keywordI]
        const kIndex = yql.indexOf(` ${keyword} `)
        if (kIndex != -1) {
            tokens.push({
                startIndex: kIndex + offset,
                scopes: "keyword"
            })
            tokens.push({
                startIndex: kIndex + keyword.length + offset + 1,
                scopes: "white"
            })
        }
    }


    //console.log("yql", yql)
    //console.log("tokens", tokens)

    tokens.sort((a, b) => {
        return a.startIndex - b.startIndex;
    })

    return tokens
}

function tokenizeYqlLine(line) {
    const yqlProp = "\"yql\""

    try {
        const trimmed = line.trim().replace(yqlProp, "")
        const yqlRegEx = /[^\"]+\"([^\"]+)\".*/
        const match = trimmed.match(yqlRegEx)
        const yql = match[1];
        const yqlIndex = line.indexOf(yql)
        // console.log(`yql ${yql} index: ${yqlIndex}`);

        const yqlTokens = tokenizeYql(yql, yqlIndex)
        // console.log("yql tokens:", yqlTokens);

        return {
            endState: new State("yql"),
            tokens: [
                {
                    startIndex: 0,
                    scopes: "entity.name",
                },
                {
                    startIndex: yqlIndex - 1,
                    scopes: "white",
                },
                // {
                //     startIndex: yqlIndex,
                //     scopes: "keyword",
                // },
                ...yqlTokens,
                {
                    startIndex: yqlIndex + yql.length,
                    scopes: "white",
                }
            ]
        };
    } catch (err) {
        return {
            endState: new State("yql"),
            tokens: [],
        };
    }
}

function highlightLine(line, yqlProp, scope) {
    const tokens = []
    const yqlPropIndex = line.indexOf(yqlProp)
    if (yqlPropIndex != -1) {
        tokens.push({
            startIndex: yqlPropIndex,
            scopes: scope
        })
        tokens.push({
            startIndex: yqlPropIndex + yqlProp.length,
            scopes: "white"
        })
    }
    return tokens
}

function tokenizeLine(line) {
    const yqlProp = "\"yql\""
    const yqlStart = line.indexOf(yqlProp)
    if (yqlStart != -1) {
        // YQL line!!
        return tokenizeYqlLine(line)
    }

    var tokens = [
        {
            startIndex: 0,
            scopes: "white"
        }
    ];
    const bracketScope = "brackethighlighter.curly"
    // const bracketScope = "keyword"
    const leftBracket = line.indexOf("{")
    if (leftBracket != -1) {
        tokens.push({
            startIndex: leftBracket,
            scopes: bracketScope
        })
        tokens.push({
            startIndex: leftBracket + 1,
            scopes: "white"
        })
    }
    const rightBracket = line.indexOf("}")
    if (rightBracket != -1) {
        tokens.push({
            startIndex: rightBracket,
            scopes: bracketScope
        })
        tokens.push({
            startIndex: rightBracket + 1,
            scopes: "white"
        })
    }

    for (const i in yqlRequestPropertyKeywords) {
        const yqlProp = yqlRequestPropertyKeywords[i];
        tokens.push(...highlightLine(line, yqlProp, "entity"));
    }

    tokens.sort((a, b) => {
        return a.startIndex - b.startIndex
    })

    //console.log("line", line)
    //console.log("tokens", tokens)

    for (const i in keywords) {
        const keyword = keywords[i];
        tokens.push(...highlightLine(line, keyword, "keyword"))
    }

    const floatRegex = /([0-9]+\.[0-9]+)/
    const r = line.match(floatRegex);
    if (r) {
        const value = r[0];
        // console.log("float", line, r.index, value);
        tokens.push({
            startIndex: r.index,
            scopes: "constant"
        })
        tokens.push({
            startIndex: r.index + value.length,
            scopes: "white"
        })

    } else {
        const intRegex = new RegExp("([0-9]+)")
        const m = line.match(intRegex);
        if (m) {
            const value = m[0];
            // console.log("integer", line, m.index, value);
            tokens.push({
                startIndex: m.index,
                scopes: "constant"
            })
            tokens.push({
                startIndex: m.index + value.length,
                scopes: "white"
            })
        }
    }

    return {
        endState: new State("any"),
        tokens: tokens,
        // tokens: [
        //     {
        //         startIndex: 0,
        //         scopes: "white"
        //     }
        // ]
    };
}

export const modelUri = monaco.Uri.parse("x://y/foo.json"); // a made up unique URI for our model


function validateYqlReq(textToValidate) {

    try {
        const yqlRequest = JSON.parse(textToValidate);
        // console.log("request to validate", yqlRequest);

        // return a list of markers indicating errors to display

        // replace the below with your actual validation code which will build
        // the proper list of markers

        var markers = []

        const result = yqlReqValidate(yqlRequest);
        // console.log("result: ", result);
        if (result.error) {
            // console.log("error: ", result.error.details);
            const errs = result.error.details.map(err => {
                return {
                    severity: monaco.MarkerSeverity.Error,
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: textToValidate.length,
                    endColumn: textToValidate.length,
                    message: `${err.message}\npath: /${err.path.join("/")}`
                }
            })
            markers.push(...errs)
        }

        // Validate YQL
        // if (yqlRequest.yql) {
        //     yqlValidate(yqlRequest.yql)
        // }

        return markers;
    } catch (error) {
        // console.log("ERROR", error.message, Object.getOwnPropertyNames(error))
        const lineAndColRegEx = /.*line ([0-9]+) column ([0-9]+).*/
        const match = error.message.match(lineAndColRegEx)
        if (match) {
            const line = parseInt(match[1]);
            const column = parseInt(match[2]);
            // console.log("line", line)
            // console.log("column", column)
            return [
                {
                    severity: monaco.MarkerSeverity.Error,
                    startLineNumber: line - 1,
                    startColumn: 1,
                    endLineNumber: line,
                    endColumn: textToValidate.length,
                    message: error.message
                }
            ];
        }


        return [
            {
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: textToValidate.length,
                endColumn: textToValidate.length,
                message: error.message
            }
        ];
    }
}

const suggestions = [
    ...yqlRequestProperties.concat(keywords).map(k => {
        return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
        }
    }),
];

export function yqlReqLanguageInit() {

    monaco.languages.registerCompletionItemProvider(YQL_DOC_TYPE, {
        provideCompletionItems: (model, position) => {
            // console.log("suggest for model", model, "pos", position);
            return { suggestions: suggestions };
        }
    });
}

export function configureYqlReqLanguage() {

    // console.log("yqlRequestPropertyKeywords", yqlRequestPropertyKeywords)

    import('../node_modules/monaco-themes/themes/GitHub Dark.json')
        .then(data => {
            // console.log("THEME", data)
            monaco.editor.defineTheme('mytheme', data);
            monaco.editor.setTheme('mytheme');
        })

    monaco.languages.register({ id: YQL_DOC_TYPE })

    // monaco.languages.setMonarchTokensProvider(DOC_TYPE, {
    //     keywords,
    //     yqlRequestPropertyKeywords,
    //     tokenizer: {
    //         // root: [
    //         //     // [/\"yql\"|\"queryProfile\"|\"trace\"/, "entity.name"],
    //         //     [yqlRequestPropertyRegex, "entity.name"],
    //         //     [/\"([^\"]+)\"/, "string"],
    //         //     [/\/\//, "comment"],
    //         //     [/[0-9]+/, "constant"],
    //         //     [
    //         //         /@?[a-zA-Z][\w$]*/,
    //         //         {
    //         //             cases: {
    //         //                 "@keywords": "keyword",
    //         //                 "@default": "variable"
    //         //             }
    //         //         }
    //         //     ]
    //         // ]
    //         root: [
    //             { include: "@yql" },
    //             { include: "@whitespace" },
    //             { include: "@numbers" },
    //             { include: "@props" },
    //             { include: "@keywords" },
    //             { include: "@strings" },
    //             { include: "@tags" },
    //             // [/^@\w+/, { cases: { "@keywords": "keyword" } }],
    //         ],
    //         whitespace: [
    //             [/\/\//, "comment"],
    //             [/\s+/, "white"],
    //         ],
    //         numbers: [
    //             [/[0-9]+/, "constant"],
    //             [/[0-9]+\.[0-9]+/, "keyword"],
    //         ],
    //         yql: [
    //             [/\"select[^\"]+\"/, "keyword"],
    //         ],
    //         strings: [
    //             [/[=|][ [0-9]+]*$/, "string.escape"],
    //             // TODO: implement invalid strings
    //             [/\"([^\"]+)\"/, "string.escape"],
    //         ],
    //         props: [
    //             [/\"[a-zA-Z][\w$]*\"/, {
    //                 cases: {
    //                     "@yqlRequestPropertyKeywords": "entity.name",
    //                 }
    //             }]
    //         ],
    //         keywords: [
    //             [/@?[a-zA-Z][\w$]*/,
    //                 {
    //                     cases: {
    //                         "@keywords": "keyword",
    //                         "@default": "variable"
    //                     }
    //                 }
    //             ]
    //         ],
    //         tags: [
    //             [/^%[a-zA-Z]\w*/, "tag"],
    //             [/#[a-zA-Z]\w*/, "tag"],
    //         ],
    //     }
    // });

    monaco.languages.setTokensProvider(YQL_DOC_TYPE, {
        getInitialState: () => {
            return new State("any");
        },
        tokenize: (line, state) => {
            // console.log('tokenize', line);
            return tokenizeLine(line)
        }
    });

    // monaco.editor.defineTheme(DOC_TYPE, {
    //   base: "vs",
    //   rules: [
    //     { token: "keyword", foreground: "#FF6600", fontStyle: "bold" },
    //     { token: "comment", foreground: "#999999" },
    //     { token: "string", foreground: "#009966" },
    //     { token: "variable", foreground: "#009966" },
    //   ],
    // });

    // only works for json files!!
    // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    //     validate: true,
    //     schemas: [{
    //       uri: modelUri,
    //       fileMatch: ['*'],
    //       schema: {
    //         type: "object",
    //         properties: {
    //           p1: {
    //             enum: ["v1", "v2"]
    //           },
    //         }
    //       }
    //     }]
    //   });

    monaco.editor.onDidCreateModel(function (model) {
        function validate() {
            var textToValidate = model.getValue();
            var markers = validateYqlReq(textToValidate)
            monaco.editor.setModelMarkers(model, YQL_DOC_TYPE, markers);
        }

        var handle = null;
        model.onDidChangeContent(() => {
            // debounce
            clearTimeout(handle);
            handle = setTimeout(() => validate(), 500);
        });
        validate();
    });

}

