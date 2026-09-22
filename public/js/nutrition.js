if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

window.calculateTDEE = function() {
    // Get values
    const gender = document.getElementById('gender').value;
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);

    // No restrictions - allow any positive numbers
    if (isNaN(age) || isNaN(weight) || isNaN(height)) {
        alert('Please fill in all fields');
        return;
    }

    // Calculate BMI
    const heightMeters = height / 100;
    const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

    // Calculate BMR (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    bmr = Math.round(bmr);

    // Calculate TDEE
    const tdee = Math.round(bmr * activity);

    // Calculate Macros (Protein 30%, Carbs 45%, Fat 25%)
    const proteinCals = Math.round(tdee * 0.30);
    const carbsCals = Math.round(tdee * 0.45);
    const fatCals = Math.round(tdee * 0.25);
    
    const proteinGrams = Math.round(proteinCals / 4);
    const carbsGrams = Math.round(carbsCals / 4);
    const fatGrams = Math.round(fatCals / 9);

    // Create result HTML
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="result-box">
            <div class="result-row">
                <span>BMI:</span>
                <strong>${bmi}</strong>
            </div>
            <div class="result-row">
                <span>BMR:</span>
                <strong>${bmr}</strong>
                <span>calories/day</span>
            </div>
            <div class="result-row highlight">
                <span>TDEE:</span>
                <strong>${tdee}</strong>
                <span>calories/day</span>
            </div>
            <div class="macro-section">
                <h4>Macronutrients</h4>
                <div class="macro-row">
                    <span class="macro-label protein">Protein (30%)</span>
                    <span><strong>${proteinGrams}g</strong> (${proteinCals} cal)</span>
                </div>
                <div class="macro-row">
                    <span class="macro-label carbs">Carbs (45%)</span>
                    <span><strong>${carbsGrams}g</strong> (${carbsCals} cal)</span>
                </div>
                <div class="macro-row">
                    <span class="macro-label fat">Fat (25%)</span>
                    <span><strong>${fatGrams}g</strong> (${fatCals} cal)</span>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
};