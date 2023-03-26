import Triangle from "./../src/triangle.js";

describe("Triangle", () => {
  test("should correctly create a triangle object with three lengths", () => {
    const triangle = new Triangle(2, 4, 5);
    expect(triangle.side1).toEqual(2);
    expect(triangle.side2).toEqual(4);
    expect(triangle.side3).toEqual(5);
  });

  test("should correctly determine whether three lenghts are not a triangle", () => {
    const notTriangle = new Triangle(3, 9, 22);
    expect(notTriangle.checkType()).toEqual("not a triangle");
  });

  test("should correctly determine whether three lengths make a scalene triangle", () => {
    const scalTriangle = new Triangle(4, 5, 7);
    expect(scalTriangle.checkType()).toEqual("scalene triangle");
  });

  test("should correctly determine whether three lengths make an isoscelese triangle", () => {
    const isoTriangle = new Triangle(6, 6, 8);
    expect(isoTriangle.checkType()).toEqual("isoscelese triangle");
  });

  test("should correctly determine whether three lengths make an equilateral triangle", () => {
    const equiTriangle = new Triangle(8, 8, 8);
    expect(equiTriangle.checkType()).toEqual("equilateral triangle");
  });
});
