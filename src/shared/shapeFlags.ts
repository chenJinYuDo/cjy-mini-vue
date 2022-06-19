export const enum ShapeFlags {
  ELEMENT = 1,
  STATEFUL_COMPONENT = 1 << 1, //左移一位
  TEXT_CHILDREN = 1 << 2, //左移两位
  ARRAY_CHILDREN = 1 << 3, //左移三位
}

/**
 * 1. 使用位运算的 ｜ 或运算进行赋值
 * 2. 使用位运算的 & 与运算进行判断
*/