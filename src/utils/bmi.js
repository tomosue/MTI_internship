// BMIを計算する

//BMI ＝ 体重kg ÷ (身長m)2
function calculationBMI(weight, height) {
  const heightM = height * 0.01;
  const BMI = weight / (heightM * heightM);
  return BMI;
}

// 別の関数を定義します。
function judgeBMI(bmi) {
  if (bmi < 16) {
    return "痩せすぎ";
  } else if (16 <= bmi && bmi <= 16.99) {
    return "痩せ";
  } else if (17 <= bmi && bmi <= 18.49) {
    return "痩せぎみ";
  } else if (18.5 <= bmi && bmi <= 24.99) {
    return "普通体重";
  } else if (25 <= bmi && bmi <= 29.99) {
    return "前肥満";
  } else if (30 <= bmi && bmi <= 34.99) {
    return "肥満(1度)";
  } else if (35 <= bmi && bmi <= 39.99) {
    return "肥満(2度)";
  } else {
    return "肥満(3度)";
  }
}

// 関数をエクスポートします。
export default {
  calculationBMI,
  judgeBMI,
};
