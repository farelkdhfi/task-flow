export const moduleData = [
    {
        id: 1,
        phase: "Beginner",
        topics: [
            {
                title: 'Variable',
                materi: 'Variables adalah container untuk menyimpan data. Dalam JavaScript, kita dapat mendeklarasikan variable menggunakan var, let, atau const. Let digunakan untuk nilai yang bisa berubah, const untuk nilai tetap. Contoh: let nama = "John"; const umur = 25;',
                exercise: 'Buatlah variabel `let nama = "Javascript"` dan `const tahun = 2024`. Lalu tampilkan keduanya dengan console.log (baris pertama nama, baris kedua tahun).',
                expectedOutput: "Javascript\n2024",
                solutionCode: `let nama = "Javascript";\nconst tahun = 2024;\nconsole.log(nama);\nconsole.log(tahun);`
            },
            {
                title: 'If-Else',
                materi: 'If-else adalah struktur kontrol untuk membuat keputusan dalam program. If akan mengeksekusi block code jika kondisi bernilai true.',
                exercise: 'Buatlah variabel `let nilai = 80`. Jika nilai >= 75 console.log("Lulus"), jika tidak console.log("Gagal").',
                expectedOutput: "Lulus",
                solutionCode: `let nilai = 80;\nif (nilai >= 75) {\n  console.log("Lulus");\n} else {\n  console.log("Gagal");\n}`
            },
            {
                title: 'Switch-Case',
                materi: 'Switch-case adalah alternatif if-else untuk membandingkan satu nilai dengan banyak kemungkinan. Lebih efisien dan readable untuk multiple kondisi yang exact match.',
                exercise: 'Buat variabel `let buah = "Apel"`. Gunakan switch-case: jika "Apel" log "Merah", jika "Jeruk" log "Kuning", default log "Tidak Tahu".',
                expectedOutput: "Merah",
                solutionCode: `let buah = "Apel";\nswitch(buah) {\n  case "Apel":\n    console.log("Merah");\n    break;\n  case "Jeruk":\n    console.log("Kuning");\n    break;\n  default:\n    console.log("Tidak Tahu");\n}`
            },
            {
                title: 'Loop',
                materi: 'Loop digunakan untuk mengulang eksekusi code. Ada 3 jenis loop utama: for, while, dan do-while. Contoh for: for(let i=0; i<5; i++) { console.log(i); }.',
                exercise: 'Gunakan for loop untuk melakukan console.log angka dari 1 sampai 5 saja.',
                expectedOutput: "1\n2\n3\n4\n5",
                solutionCode: `for(let i = 1; i <= 5; i++) {\n  console.log(i);\n}`
            },
            {
                title: 'If-Loop',
                materi: 'Kombinasi if-else dengan loop memungkinkan kita melakukan filtering atau conditional processing dalam iterasi.',
                exercise: 'Loop dari angka 1 sampai 10. Jika angka adalah GENAP, lakukan console.log angka tersebut.',
                expectedOutput: "2\n4\n6\n8\n10",
                solutionCode: `for(let i = 1; i <= 10; i++) {\n  if(i % 2 === 0) {\n    console.log(i);\n  }\n}`
            },
            {
                title: 'Nested Loop',
                materi: 'Nested loop adalah loop di dalam loop. Berguna untuk memproses struktur data 2 dimensi seperti matrix, atau membuat pola tertentu.',
                exercise: 'Buat pola kotak 3x3 bintang (*) menggunakan nested loop. Output harus 3 baris, setiap baris ada 3 bintang (Misal: "***"). Gunakan console.log untuk setiap baris.',
                expectedOutput: "***\n***\n***",
                solutionCode: `for(let i = 0; i < 3; i++) {\n  let row = "";\n  for(let j = 0; j < 3; j++) {\n    row += "*";\n  }\n  console.log(row);\n}`
            },
            {
                title: 'Functions',
                materi: 'Function adalah block code yang dapat digunakan kembali (reusable). Deklarasi function: function namaFunction(parameter) { return value; }.',
                exercise: 'Buat function `tambah(a, b)` yang mengembalikan a + b. Lalu panggil `console.log(tambah(10, 5))`.',
                expectedOutput: "15",
                solutionCode: `function tambah(a, b) {\n  return a + b;\n}\nconsole.log(tambah(10, 5));`
            },
            {
                title: 'Scope and Hoisting',
                materi: 'Scope menentukan aksesibilitas variable. Ada global scope dan local scope. Let dan const memiliki block scope, var memiliki function scope.',
                exercise: 'Demonstrasikan scope: Buat block `{ let lokal = "Rahasia" }`. Coba akses `console.log(lokal)` di luar block. Gunakan try-catch agar error tertangkap dan log "Error Tertangkap".',
                expectedOutput: "Error Tertangkap",
                solutionCode: `try {\n  {\n    let lokal = "Rahasia";\n  }\n  console.log(lokal);\n} catch(e) {\n  console.log("Error Tertangkap");\n}`
            },
            {
                title: 'Array and Object',
                materi: 'Array adalah struktur data untuk menyimpan multiple values. Object adalah collection of key-value pairs.',
                exercise: 'Buat array `let angka = [10, 20, 30]`. Ubah angka kedua (index 1) menjadi 50. Lalu console.log seluruh array.',
                expectedOutput: "10,50,30",
                solutionCode: `let angka = [10, 20, 30];\nangka[1] = 50;\nconsole.log(angka.toString());`
            },
            {
                title: 'DOM',
                materi: 'DOM (Document Object Model) adalah representasi struktur HTML. JavaScript dapat memanipulasi DOM untuk mengubah content dan style.',
                exercise: 'Latihan Playground (Mode Bebas): Gunakan `document.body.style.backgroundColor = "red"` untuk mengubah warna background halaman editor ini.',
                expectedOutput: null, 
                solutionCode: `document.body.style.backgroundColor = "darkred";\nconsole.log("Background berubah jadi merah gelap!");`
            },
            {
                title: 'Event Handling',
                materi: 'Event adalah aksi yang terjadi di halaman web (click, hover, submit). addEventListener adalah cara recommended menangani event.',
                exercise: 'Latihan Playground (Mode Bebas): Buat alert saat halaman diklik menggunakan `window.onclick`.',
                expectedOutput: null,
                solutionCode: `window.onclick = () => alert("Kamu mengklik area window!");`
            },
            {
                title: 'Special Array',
                materi: 'JavaScript memiliki array methods powerful seperti map, filter, reduce.',
                exercise: 'Diberikan `const arr = [1, 2, 3, 4, 5]`. Gunakan .filter() untuk mengambil angka > 3, lalu console.log hasilnya.',
                expectedOutput: "4,5",
                solutionCode: `const arr = [1, 2, 3, 4, 5];\nconst hasil = arr.filter(x => x > 3);\nconsole.log(hasil.toString());`
            }
        ]
    },
    {
        id: 2,
        phase: "Intermediate",
        topics: [
            {
                title: 'Class',
                materi: 'Class adalah blueprint untuk membuat objects dengan properties dan methods.',
                exercise: 'Buat class `Siswa` dengan constructor(nama). Buat method `sapa()` yang return "Halo " + nama. Buat instance dengan nama "Budi" dan log hasil sapa().',
                expectedOutput: "Halo Budi",
                solutionCode: `class Siswa {\n  constructor(nama) {\n    this.nama = nama;\n  }\n  sapa() {\n    return "Halo " + this.nama;\n  }\n}\nconst s1 = new Siswa("Budi");\nconsole.log(s1.sapa());`
            },
            {
                title: 'Spread and Rest',
                materi: 'Spread operator (...) digunakan untuk menyebarkan elements. Rest operator mengumpulkan arguments.',
                exercise: 'Gabungkan dua array `a = [1, 2]` dan `b = [3, 4]` menjadi satu array baru menggunakan spread operator. Console.log hasilnya.',
                expectedOutput: "1,2,3,4",
                solutionCode: `const a = [1, 2];\nconst b = [3, 4];\nconst gabung = [...a, ...b];\nconsole.log(gabung.toString());`
            },
            {
                title: 'Module Export and Import',
                materi: 'Modules memungkinkan pemisahan code ke multiple files. (Note: Di editor ini kita simulasi konsepnya saja).',
                exercise: 'Latihan Concept: Buat object `MathUtils` yang punya method `add`. Panggil method tersebut. (Playground Mode)',
                expectedOutput: null,
                solutionCode: `const MathUtils = {\n  add: (x, y) => x + y\n};\nconsole.log(MathUtils.add(5, 10));`
            },
            {
                title: 'Nullish Coalescing and Optional Chaining',
                materi: 'Nullish Coalescing (??) cek null/undefined. Optional Chaining (?.) akses nested properties dengan aman.',
                exercise: 'Diberikan `let user = {}` (kosong). Gunakan `??` untuk menampilkan `user.name` atau default string "Guest". Console.log hasilnya.',
                expectedOutput: "Guest",
                solutionCode: `let user = {};\nconsole.log(user.name ?? "Guest");`
            },
            {
                title: 'High Order Functions',
                materi: 'Higher Order Function menerima function sebagai argument. Contoh: map, reduce.',
                exercise: 'Gunakan .map() pada array `[1, 2, 3]` untuk mengalikan setiap angka dengan 2. Console.log hasilnya.',
                expectedOutput: "2,4,6",
                solutionCode: `const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled.toString());`
            },
            {
                title: 'Regex',
                materi: 'Regular Expression (Regex) adalah pattern matching untuk string operations.',
                exercise: 'Gunakan regex `/halo/i` untuk mengetes string "Halo Dunia". Console.log hasil test() (harus true).',
                expectedOutput: "true",
                solutionCode: `const pattern = /halo/i;\nconsole.log(pattern.test("Halo Dunia"));`
            },
            {
                title: 'Date and Time',
                materi: 'Date object digunakan untuk bekerja dengan tanggal dan waktu.',
                exercise: 'Buat object Date untuk tanggal "2024-01-01". Console.log tahunnya menggunakan .getFullYear().',
                expectedOutput: "2024",
                solutionCode: `const d = new Date("2024-01-01");\nconsole.log(d.getFullYear());`
            },
            {
                title: 'Set and Map Data Structure',
                materi: 'Set adalah collection of unique values. Map adalah collection of key-value pairs.',
                exercise: 'Buat Set baru dari array `[1, 2, 2, 3]`. Console.log ukuran set (size) untuk membuktikan duplikat hilang.',
                expectedOutput: "3",
                solutionCode: `const mySet = new Set([1, 2, 2, 3]);\nconsole.log(mySet.size);`
            },
            {
                title: 'Symbol and Iterator',
                materi: 'Symbol adalah primitive type unique. Iterator memungkinkan object diloop.',
                exercise: 'Buat Symbol dengan deskripsi "id". Console.log deskripsinya (string).',
                expectedOutput: "Symbol(id)",
                solutionCode: `const sym = Symbol("id");\nconsole.log(sym.toString());`
            },
            {
                title: 'Shallow Copy vs Deep Copy',
                materi: 'Shallow copy hanya copy reference level 1. Deep copy copy seluruhnya.',
                exercise: 'Buat object `a = { val: 1 }`. Copy ke `b` pakai spread `{...a}`. Ubah `b.val = 2`. Console.log `a.val` (harus tetap 1).',
                expectedOutput: "1",
                solutionCode: `let a = { val: 1 };\nlet b = {...a};\nb.val = 2;\nconsole.log(a.val);`
            },
            {
                title: 'Asychronus',
                materi: 'Asynchronous programming memungkinkan code berjalan tanpa blocking (Promise, Async/Await).',
                exercise: 'Latihan Playground: Buat Promise sederhana yang langsung resolve "Sukses" dan log hasilnya via .then().',
                expectedOutput: null,
                solutionCode: `Promise.resolve("Sukses").then(res => console.log(res));`
            },
            {
                title: 'Error Hadling',
                materi: 'Error handling mencegah aplikasi crash. Gunakan try-catch.',
                exercise: 'Lakukan `throw new Error("Boom")` di dalam blok try. Catch errornya dan console.log pesan errornya (message).',
                expectedOutput: "Boom",
                solutionCode: `try {\n  throw new Error("Boom");\n} catch(e) {\n  console.log(e.message);\n}`
            },
            {
                title: 'Localstorage and Sessionstorage',
                materi: 'Web Storage API menyimpan data di browser.',
                exercise: 'Latihan Playground: Set item ke localStorage dengan key "test" dan value "123". Lalu log get item tersebut.',
                expectedOutput: null,
                solutionCode: `localStorage.setItem("test", "123");\nconsole.log(localStorage.getItem("test"));`
            },
            {
                title: 'JSON',
                materi: 'JSON format text untuk data exchange. JSON.stringify() dan JSON.parse().',
                exercise: 'Ubah object `{id: 1}` menjadi string JSON. Console.log hasilnya.',
                expectedOutput: '{"id":1}',
                solutionCode: `const obj = {id: 1};\nconsole.log(JSON.stringify(obj));`
            },
            {
                title: 'Fetch API',
                materi: 'Fetch API interface modern untuk HTTP requests.',
                exercise: 'Latihan Playground: Fetch data dummy dari "https://jsonplaceholder.typicode.com/todos/1" dan log hasilnya.',
                expectedOutput: null,
                solutionCode: `fetch('https://jsonplaceholder.typicode.com/todos/1')\n.then(res => res.json())\n.then(data => console.log(data));`
            }
        ]
    },
    {
        id: 3,
        phase: "Advance",
        topics: [
            {
                title: 'Closure and Lexical',
                materi: 'Closure adalah function yang memiliki akses ke variables di outer scope.',
                exercise: 'Buat function `outer()` yang punya variabel `count = 0` dan return function inner. Function inner melakukan `count++` dan return count. Panggil 2 kali dan log hasilnya (1 dan 2).',
                expectedOutput: "1\n2",
                solutionCode: `function outer() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  }\n}\nconst counter = outer();\nconsole.log(counter());\nconsole.log(counter());`
            },
            {
                title: 'Inheritance and Prototype',
                materi: 'Inheritance memungkinkan object mewarisi fitur dari object lain.',
                exercise: 'Buat class `Hewan` (method `suara()` return "Bunyi"). Buat class `Kucing` extends `Hewan` (override `suara()` return "Meow"). Console.log suara kucing.',
                expectedOutput: "Meow",
                solutionCode: `class Hewan {\n  suara() { return "Bunyi"; }\n}\nclass Kucing extends Hewan {\n  suara() { return "Meow"; }\n}\nconst k = new Kucing();\nconsole.log(k.suara());`
            }
        ]
    }
];