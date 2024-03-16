https://raw.githack.com/bugaenkoey/Tetris/dev/index.html
https://raw.githack.com/bugaenkoey/Tetris/dev2/index.html
https://bugaenkoey.github.io/Tetris/

// ДЗ №1
// 1. Додати нові фігури
// 2. Стилізувати нові фігури
// 3. Додати функцію рандому котра буде поветати випадкову фігуру
// 4. Центрувати фігуру незалежно від ширини

// ДЗ №2
// 1. Поставити const rowTetro = -2; прописати код щоб працювало коректно
// 2. Зверстати поле для розрахунку балів гри
// 3. Прописати логіку і код розрахунку балів гри (1 ряд = 10; 2 ряди = 30; 3 ряди = 50; 4 = 100)
// 4. Реалізувати самостійний рух фігур до низу

Game Tetris.
<-  left button     step left
->  right button    step right
^   button up       rotate figure
v   button down     step down
SPACE               creates new figure
ESC                 pause

When the row is full, it is deleted and the background is changed.
1 point is awarded for each figure. For each completed line, 10 points are awarded, which are increased by the number of simultaneously performed lines.

Гра Тетріс.
<-  кнопка вліво    крок ліворуч
->  кнопка вправо   крок праворуч
^   кнопка вгору    повернути фігуру
v   кнопка вниз     крок вниз
ПРОБІЛ              створює нову фігуру
ESC                 пауза

Коли рядок заповнюється, він видаляється, а фон змінюється.
За кожну фігуру нараховується 1 бал. За кожен завершений рядок нараховується 10 балів, які збільшуються на кількість одночасно виконаних рядків.
