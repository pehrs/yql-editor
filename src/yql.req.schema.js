const Joi = require('joi');

// Source https://docs.vespa.ai/en/reference/query-api-reference.html
const yqlReqSchema = Joi.object({
    yql: Joi.string()
        .min(3)
        .required(),

    hits: Joi.number()
        .integer(),

    offset: Joi.number()
        .integer(),

    queryProfile: Joi.string()
        .alphanum()
        .min(1),

    groupingSessionCache: Joi.boolean(),

    searchChain: Joi.string()
        .alphanum()
        .min(1),

    timeout: Joi.string(),

    model: Joi.object()
        .keys({
            defaultIndex: Joi.string(),
            encoding: Joi.string(),
            filter: Joi.string(),
            locale: Joi.string(),
            language: Joi.string(),
            queryString: Joi.string(),
            restrict: Joi.string(),
            searchPath: Joi.string(),
            sources: Joi.string(),
            type: Joi.string()
        })
        .optional(),

    input: Joi.object(),

    ranking: [Joi.string(), 
        Joi.object()
        .keys({
            location: Joi.string(),
            features: Joi.object(),
            listFeatures: Joi.boolean(),
            profile: Joi.string(),
            properties: Joi.object(),
            softtimeout: Joi.object()
                .keys({
                    enable: Joi.boolean(),
                    factor: Joi.number(),
                }),
            sorting: Joi.string(),
            freshness: Joi.string(),
            queryCache: Joi.boolean(),
            rerankCount: Joi.number(),
            keepRankCount: Joi.number(),
            rankScoreDropLimit: Joi.number(),
            globalPhase: Joi.object()
                .keys({
                    rerankCount: Joi.boolean(),
                }),
            matching: Joi.object()
                .keys({
                    numThreadsPerSearch: Joi.number().integer(),
                    minHitsPerThread: Joi.number().integer(),
                    numSearchPartitions: Joi.number().integer(),
                    termwiseLimit: Joi.number()
                        .min(0.0)
                        .max(1.0),
                    postFilterThreshold: Joi.number()
                        .min(0.0)
                        .max(1.0),
                    approximateThreshold: Joi.number()
                        .min(0.0)
                        .max(1.0),
                    targetHitsMaxAdjustmentFactor: Joi.number()
                        .min(1.0),
                }),
            matchPhase: Joi.object()
                .keys({
                    attribute: Joi.string(),
                    maxHits: Joi.number().integer(),
                    ascending: Joi.boolean(),
                    diversity: Joi.object()
                        .keys({
                            attribute: Joi.string(),
                            minGroups: Joi.number().integer(),
                        }),
                }),
        })
        .optional()
    ],

    dispatch: Joi.object()
        .keys({
            topKProbability: Joi.number(),
        }),
    presentation: Joi.object()
        .keys({
            bolding: Joi.boolean(),
            format: Joi.string(),
            summary: Joi.string(),
            template: Joi.string(),
            timing: Joi.boolean(),
            format: Joi.object()
                .keys({
                    tensors: Joi.string()
                        .regex(/short|long|shot-value|long-value/),
                }),
        }),

    select: Joi.string(),
    collapsefield: Joi.string(),
    collapsesize: [
        Joi.number(),
        Joi.object(),
    ],
    collapse: Joi.object()
        .keys({
            summary: Joi.string()
        }),

    grouping: Joi.object()
        .keys({
            defaultMaxGroups: Joi.number().integer().min(-1),
            defaultMaxHits: Joi.number().integer().min(-1),
            globalMaxGroups: Joi.number().integer().min(-1),
            defaultPrecisionFactor: Joi.number(),
        }),

    streaming: Joi.object()
        .keys({
            groupname: Joi.string(),
            selection: Joi.string(),
            maxbucketspervisitor: Joi.number().integer(),
        }),

    trace: Joi.object()
        .keys({
            level: Joi.number().integer()
                .min(0).max(7),
            explainLevel: Joi.number().integer()
                .min(0).max(2),
            profileDepth: Joi.number().integer()
                .min(0),
            timestamps: Joi.boolean(),
            query: Joi.boolean(),
            profiling: Joi.object()
                .keys({
                    matching: Joi.object()
                        .keys({
                            depth: Joi.number().integer().min(0),
                        }),
                    firstPhaseRanking: Joi.object()
                        .keys({
                            depth: Joi.number().integer().min(0),
                        }),
                    secondPhaseRanking: Joi.object()
                        .keys({
                            depth: Joi.number().integer().min(0),
                        }),

                })
        }),

    rules: Joi.object()
        .keys({
            off: Joi.boolean(),
            rulebase: Joi.string(),
        }),

    tracelevel: Joi.object()
        .keys({
            rules: Joi.number(),
        }),

    recall: Joi.string(),
    user: Joi.string(),
    hitcountestimate: Joi.boolean(),
    metrics: Joi.object()
        .keys({
            ignore: Joi.boolean(),
        }),
    weakAnd: Joi.object()
        .keys({
            replace: Joi.boolean(),
        }),
    wand: Joi.object()
        .keys({
            hits: Joi.number().integer().min(0),
        }),
    sorting: Joi.object()
        .keys({
            degrading: Joi.boolean(),
        }),
    noCache: Joi.boolean(),
})

export function yqlReqValidate(yqlReq) {
    try {
        return yqlReqSchema.validate(yqlReq);
    }
    catch (err) {
        throw err
    }
}