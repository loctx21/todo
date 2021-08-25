const Item = require("./Item")
// @ponicode
describe("persitDelete", () => {
    let inst

    beforeEach(() => {
        inst = new Item.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.persitDelete()
        }
    
        expect(callFunction).not.toThrow()
    })
})
