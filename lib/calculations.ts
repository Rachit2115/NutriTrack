/**
 * Calculate Body Mass Index (BMI)
 * BMI = weight (kg) / (height (m))^2
 */
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * Based on the Harris-Benedict equation
 */
export function calculateTDEE(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
): number {
  // Calculate Basal Metabolic Rate (BMR)
  let bmr: number
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Apply activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Hard exercise 6-7 days/week
    "very-active": 1.9, // Very hard exercise & physical job
  }

  return Math.round(bmr * activityMultipliers[activityLevel])
}

