const Movement = require("./animation");
const updateHealth = require("./animation2");

describe("Movement testing",  () => {
    it("updates health when collision occurs at x position 100 ", ()=> {
        let xValue = 0;

        while(xValue !=  100){
            xValue = Movement();
        }
        let health  = 10;
        health = updateHealth();
        let expected = 100;
        expect(expected).toBe(health);
        expect(expected).toBe(xValue);
    });
});