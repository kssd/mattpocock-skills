/writing-shape

Here is my raw material:

---
TypeScript's type system gets called "complex" a lot. What people mean is: there's a lot of it to learn. But the complexity isn't arbitrary. It's there because JavaScript is dynamic, and dynamic languages need expressive types to be safe.

The hardest part for newcomers is generics. People see `<T>` and freeze. But generics are just variables for types. You already understand variables. Generics are the same idea applied one level up.

I spent three years teaching TypeScript workshops. The moment that clicked for most people: when I stopped saying "generic" and started saying "type variable." Suddenly `<T>` was just a name you give to a type so you can refer to it later.

Conditional types trip people up too. `A extends B ? C : D`. It looks like a ternary. It is a ternary — just at the type level. The problem isn't the concept, it's that nobody teaches the analogy. They just show the syntax and hope.

The insight I keep coming back to: TypeScript's type system is a programming language inside a programming language. Once you accept that, you stop being surprised by its features and start being curious about what else you can build with it.
---

Where should I save the article?
