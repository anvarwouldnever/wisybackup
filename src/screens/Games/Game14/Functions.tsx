export const addCurvedLine = (data, setIsDrawing, setLines) => {
    setIsDrawing(false);
    setLines((prev) => [...prev, data]);
};