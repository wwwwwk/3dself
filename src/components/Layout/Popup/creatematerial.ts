const createMaterial = (data:any) => {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 300;
    canvas.style.border = "1px solid #ffffff";
    canvas.style.backgroundColor = "#ff0000";
    
    const ctx = canvas.getContext('2d');

    ctx?.beginPath();
    
    ctx?.fillRect(10, 10, 480, 40);
};