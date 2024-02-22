const parser = require('js-sql-parser');

// FIXME: The js-sql-parser cannot be extended with the YQL specific keywords and function constructs.
export function yqlValidate(yqlString) {
    try {
        const ast = parser.parse(yqlString);
        console.log("YQL", JSON.stringify(ast, null, 2));
    } catch (err) {
        console.log("err", err);
    }
}