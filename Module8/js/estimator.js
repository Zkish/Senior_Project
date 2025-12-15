    function flooringCalc() {
      const len = parseFloat(document.getElementById("floor_len").value);
      const wid = parseFloat(document.getElementById("floor_width").value);
      const cost = parseFloat(document.getElementById("floor_cost").value);
      const sqft = len * wid;
      const total = sqft * cost;
      document.getElementById("floor_output").innerText =
        !isNaN(total) ? `Total Cost: $${total.toFixed(2)}` : "Please enter valid numbers.";
    }

    function paintCalc() {
      const perim = parseFloat(document.getElementById("paint_perim").value);
      const height = parseFloat(document.getElementById("paint_height").value);
      const cover = parseFloat(document.getElementById("paint_cover").value);
      const area = perim * height;
      const gallons = area / cover;
      document.getElementById("paint_output").innerText =
        !isNaN(gallons) ? `Gallons Needed: ${gallons.toFixed(2)}` : "Please enter valid numbers.";
    }

    function drywallCalc() {
      const sqft = parseFloat(document.getElementById("drywall_sqft").value);
      const sheetCost = parseFloat(document.getElementById("drywall_cost").value);
      const sheetArea = 32; // 4x8 sheet
      const sheets = sqft / sheetArea;
      const total = sheets * sheetCost;
      document.getElementById("drywall_output").innerText =
        !isNaN(total) ? `Sheets: ${Math.ceil(sheets)}, Estimated Cost: $${total.toFixed(2)}` : "Please enter valid numbers.";
    }


    /* Roofing Shingle Calculator Script */
    function roofCalc() {
    const area = parseFloat(document.getElementById("roof_area").value);
    const coverage = parseFloat(document.getElementById("roof_bundle").value);
    const costPerBundle = parseFloat(document.getElementById("roof_cost").value);

    if (isNaN(area) || isNaN(coverage) || isNaN(costPerBundle) || coverage === 0) {
        document.getElementById("roof_output").innerHTML =
            "<span style='color:black;'>Please enter valid numbers.</span>";
        return;
    }

    const bundlesNeeded = area / coverage;
    const totalCost = bundlesNeeded * costPerBundle;

    document.getElementById("roof_output").innerHTML =
        `<strong>Bundles Needed:</strong> ${Math.ceil(bundlesNeeded)}<br>
         <strong>Estimated Cost:</strong> $${totalCost.toFixed(2)}`;
    }



    /* Insulation R-Value Estimator Script */
    function insulCalc() {
    const area = parseFloat(document.getElementById("insul_area").value);
    const rPerInch = parseFloat(document.getElementById("insul_rinch").value);
    const desiredR = parseFloat(document.getElementById("insul_desired").value);

    if (isNaN(area) || isNaN(rPerInch) || isNaN(desiredR) || rPerInch === 0) {
        document.getElementById("insul_output").innerHTML =
            "<span style='color:black;'>Please enter valid numbers.</span>";
        return;
    }

    const thicknessNeeded = desiredR / rPerInch;

    document.getElementById("insul_output").innerHTML =
        `<strong>Required Thickness:</strong> ${thicknessNeeded.toFixed(2)} inches<br>
         <strong>Total Coverage Area:</strong> ${area.toFixed(2)} sq ft`;
    }


    /* Lumber Board Foot Calculator Script */

    function lumberCalc() {
    const thickness = parseFloat(document.getElementById("lumber_thickness").value);
    const width = parseFloat(document.getElementById("lumber_width").value);
    const length = parseFloat(document.getElementById("lumber_length").value);
    const costPerBoardFoot = parseFloat(document.getElementById("lumber_cost").value);

    if (isNaN(thickness) || isNaN(width) || isNaN(length) || isNaN(costPerBoardFoot)) {
        document.getElementById("lumber_output").innerHTML =
            "<span style='color:black;'>Please enter valid numbers.</span>";
        return;
    }

    const boardFeet = (thickness * width * length) / 12;
    const totalCost = boardFeet * costPerBoardFoot;

    document.getElementById("lumber_output").innerHTML =
        `<strong>Board Feet:</strong> ${boardFeet.toFixed(2)}<br>
         <strong>Estimated Cost:</strong> $${totalCost.toFixed(2)}`;
    }


    

    /* Concrete Volume Calculator Script */
    function concreteCalc() {
    const length = parseFloat(document.getElementById("con_len").value);
    const width = parseFloat(document.getElementById("con_wid").value);
    const depth = parseFloat(document.getElementById("con_depth").value); // inches

    if (isNaN(length) || isNaN(width) || isNaN(depth)) {
        document.getElementById("concrete_output").innerHTML =
            "<span style='color:black;'>Please enter valid numbers.</span>";
        return;
    }

    // Convert to cubic yards
    const cubicYards = (length * width * depth) / 324;

    document.getElementById("concrete_output").innerHTML =
        `<strong>Concrete Needed:</strong> ${cubicYards.toFixed(2)} cubic yards`;
    }

   


    /*Regression Size and Cost Caluclator Script*/ 

   
    const slope = 7.15;      
    const intercept = 80.50; 

    function runRegressionEstimator() {
        const length = parseFloat(document.getElementById("reg_length").value);
        const width  = parseFloat(document.getElementById("reg_width").value);

        if (isNaN(length) || isNaN(width)) {
            document.getElementById("reg_output").innerHTML =
                "<span style='color:black;'>Please enter valid numbers.</span>";
            return;
        }

        const size = length * width;  
        const predictedCost = (slope * size) + intercept;

        document.getElementById("reg_output").innerHTML =
            `Predicted Cost (Analytics-Based): <strong>$${predictedCost.toFixed(2)}</strong>`;
      }