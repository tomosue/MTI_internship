// 別の関数を定義します。
function messageFood(bmi) {
  if (bmi < 16) {
    return "カロリー摂取が足りていません。食事の量を増やしましょう。カロリーの高いものを摂取しましょう。";
  } else if (16 <= bmi && bmi <= 16.99) {
    return "カロリー摂取が足りていません。もう少し食事をしましょう。";
  } else if (17 <= bmi && bmi <= 18.49) {
    return "少しカロリー摂取が足りていません。食事を見直しましょう。";
  } else if (18.5 <= bmi && bmi <= 24.99) {
    return "いい感じです！バランスの良い食事を心がけましょう！";
  } else if (25 <= bmi && bmi <= 29.99) {
    return "少しカロリー摂取を控えましょう。";
  } else if (30 <= bmi && bmi <= 34.99) {
    return "太り気味です。食事を見直しましょう。";
  } else if (35 <= bmi && bmi <= 39.99) {
    return "太り気味です。食事の量を減らし、カロリー摂取を控えましょう。";
  } else {
    return "重度の肥満です。直ちに、食事を改善し、カロリー摂取を控えましょう。医師と相談しダイエットしましょう。";
  }
}
function messageExercise(bmi) {
  if (bmi < 16) {
    return "痩せすぎです。適度に運動をしましょう";
  } else if (16 <= bmi && bmi <= 16.99) {
    return "瘦せすぎです。適度に運動をしましょう";
  } else if (17 <= bmi && bmi <= 18.49) {
    return "痩せぎみです。適度に運動をしましょう";
  } else if (18.5 <= bmi && bmi <= 24.99) {
    return "いい感じです。このまま適度に運動しましょう。";
  } else if (25 <= bmi && bmi <= 29.99) {
    return "少し運動しましょう。軽めの運動が効果的です。";
  } else if (30 <= bmi && bmi <= 34.99) {
    return "運動しましょう。外に出て運動してみましょう。";
  } else if (35 <= bmi && bmi <= 39.99) {
    return "肥満体形です。外に出て思いっきり体を動かしましょう。";
  } else {
    return "重度の肥満です。直ちに、生活を見直しましょう。医師と相談しダイエットしましょう。";
  }
}
function messageColor(bmi) {
  if (bmi < 16) {
    return "red";
  } else if (16 <= bmi && bmi <= 16.99) {
    return "red";
  } else if (17 <= bmi && bmi <= 18.49) {
    return "yellow";
  } else if (18.5 <= bmi && bmi <= 24.99) {
    return "blue";
  } else if (25 <= bmi && bmi <= 29.99) {
    return "yellow";
  } else if (30 <= bmi && bmi <= 34.99) {
    return "red";
  } else if (35 <= bmi && bmi <= 39.99) {
    return "red";
  } else {
    return "red";
  }
}
// 関数をエクスポートします。
export default {
  messageFood,
  messageExercise,
  messageColor,
};
