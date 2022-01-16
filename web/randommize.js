/*
|--------------------------------------------------------------------------
| Randomize
|--------------------------------------------------------------------------
| @Author: Eduardo Castro <Skillerm>
| @Date: 2022-01-15
*/

class Randomize {

    ClassesCache = [];
    FunctionsCache = [];
    JsClassesCache = [];
    VariablesCache = [];

    SetContent(content) {
        this.Content = content;
        this.ClassesCache = [];
        this.FunctionsCache = [];
        this.JsClassesCache = [];
        this.VariablesCache = [];
        this.Css.Start();
        this.Js.Start();
    }

    ChangeContent([...args]) {
        if (args.indexOf("classe") > -1) {
            this.ClassesCache.forEach((element) => {
                const Cont = this.Content;
                this.Content = this.Addons.replaceAll(this.Content, element.old, element.new, "classecss");
            });
        }
        if (args.indexOf("function") > -1) {
            this.FunctionsCache.forEach((element, i) => {
                this.Content = this.Addons.replaceAll(this.Content, element.old, element.new, "functionjs");
            });
        }
        if (args.indexOf("jsclass") > -1) {
            this.JsClassesCache.forEach((element, i) => {
                this.Content = this.Addons.replaceAll(this.Content, element.old, element.new, "jsclass");
            });
        }
        //if (args.indexOf("variable") > -1) {
        //    this.VariablesCache.forEach((element, i) => {
        //        this.Content = this.Addons.replaceAll(this.Content, element.old, element.new);
        //    });
        //}
        //
    }

    GetContent() {
        return this.Content;
    }

    GetCache() {
        return {
            ClassesCache: this.ClassesCache,
            FunctionsCache: this.FunctionsCache,
            JsClassesCache: this.JsClassesCache,
            VariablesCache: this.VariablesCache
        }
    }

    Addons = {
        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        replaceAll2: (str, find, replace) => {
            return str.replace(new RegExp(this.Addons.escapeRegExp(find), 'g'), replace);
        },

        replaceAll(str, find, replace, typee) {

            const toDom = new DOMParser().parseFromString(str, "text/html")

            if (typee == "classecss") {

                Array.from(toDom.querySelectorAll("style")).forEach((el) => {
                    el.innerHTML = el.innerHTML.replaceAll(find, replace);
                });
                Array.from(toDom.querySelectorAll('.' + find)).forEach((el) => {
                    el.classList.replace(find, replace);
                });
            }

            if (typee == "functionjs") {
                Array.from(toDom.querySelectorAll("script")).forEach((el) => {
                    el.innerHTML = el.innerHTML.replaceAll(find + "(", replace + "(");
                });

                Array.from(toDom.getElementsByTagName('*')).forEach((el) => {
                    Array.from(el.attributes).forEach((attr) => {
                        attr.value = attr.value.replace(find + "(", replace + "(");
                    });
                });
            }

            if (typee == "jsclass") {
                Array.from(toDom.querySelectorAll("script")).forEach((el) => {
                    el.innerHTML = el.innerHTML.replaceAll("class " + find, "class " + replace);
                    el.innerHTML = el.innerHTML.replaceAll("new " + find, "new " + replace);
                });

                Array.from(toDom.getElementsByTagName('*')).forEach((el) => {
                    Array.from(el.attributes).forEach((attr) => {
                        attr.value = attr.value.replace("new " + find, "new " + replace);
                    });
                });
            }

            if (typee == "variable") {

                // Array.from(toDom.querySelectorAll("script")).forEach((el) => {
                //     el.innerHTML = el.innerHTML.replaceAll("const = "+ find, "const "+ replace);
                //     el.innerHTML = el.innerHTML.replaceAll("let "+ find, "let "+ replace);
                //     el.innerHTML = el.innerHTML.replaceAll("var "+ find, "var "+ replace);
                //
                // });

            }


            return toDom.querySelector('html').innerHTML;

        },

        GenerateRandomString: function (min, max) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for (var i = 0; i < Math.floor(Math.random() * (max - min + 1)) + min; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    }


    Js = {

        ChangeNamesClasses: (ArrayClasses) => {
            ArrayClasses.forEach(Classe => {
                let NewName = this.Addons.GenerateRandomString(Classe.length, Classe.length * 2);
                this.JsClassesCache.push({
                    old: Classe,
                    new: NewName
                });
            })
        },

        ChangeNamesFunctions: (ArrayFunctions) => {
            ArrayFunctions.forEach((Function) => {
                let NewName = this.Addons.GenerateRandomString(Function.length, Function.length);
                //this.FunctionsCache.push(Function);
                //this.Content = this.Addons.replaceAll(this.Content, Function, NewName);
                // add the old and new functions to the cache
                this.FunctionsCache.push({
                    old: Function,
                    new: NewName
                });
            });
        },

        ChangeNamesVariables: (ArrayVariables) => {
            ArrayVariables.forEach((Variable) => {
                let NewName = this.Addons.GenerateRandomString(Variable.length, Variable.length * 2);
                //this.VariablesCache.push(Variable);
                //this.Content = this.Addons.replaceAll(this.Content, Variable, NewName);
                // add the old and new variables to the cache
                this.VariablesCache.push({
                    old: Variable,
                    new: NewName
                });
            });
        },

        FindVariables: () => {
            let Variables = [];
            let regex = /\b(var|let|const)\s+([\w\d]+)\b/g;
            let match;
            while (match = regex.exec(this.Content)) {
                Variables.push(match[2]);
            }
            return Variables;
        },

        FindClasses: () => {
            var doc = new DOMParser().parseFromString(this.Content, "text/html");
            let js = doc.querySelectorAll("script");
            const classenames = [];
            for (let i = 0; i < js.length; i++) {
                let code = js[i].textContent;
                let regex = /class\s+([a-zA-Z0-9_]+)/g;
                let match;
                while ((match = regex.exec(code)) !== null) {
                    classenames.push(match[1]);
                }

            }
            return classenames;
        },

        FindFunctions: () => {
            var doc = new DOMParser().parseFromString(this.Content, "text/html");
            let js = doc.querySelectorAll("script");

            // get name of functions
            let functions = [];
            for (let i = 0; i < js.length; i++) {
                let code = js[i].textContent;
                let regex = /function\s+(\w+)\s*\(/g;
                let match;
                while ((match = regex.exec(code)) !== null) {
                    functions.push(match[1]);
                }
            }

            return functions;

        },

        Start: () => {
            const Functions = this.Js.FindFunctions();
            this.Js.ChangeNamesFunctions(Functions);

            const Classes = this.Js.FindClasses();
            this.Js.ChangeNamesClasses(Classes);

            const Variables = this.Js.FindVariables();
            this.Js.ChangeNamesVariables(Variables);
        }

    }

    Css = {

        ChangeNames: (ArrayClasses) => {
            for (var i = 0; i < ArrayClasses.length; i++) {
                var newClass = this.Addons.GenerateRandomString(ArrayClasses[i].length, ArrayClasses[i].length);
                //this.Content = this.Addons.replaceAll(this.Content, ArrayClasses[i], newClass);

                // add the old and new class to the cache
                this.ClassesCache.push({
                    old: ArrayClasses[i],
                    new: newClass
                });
            }
        },

        Find: () => {
            var doc = new DOMParser().parseFromString(this.Content, "text/html");
            let css = doc.querySelectorAll("style");
            let classesc = [];

            Array.from(css).forEach((el) => {
                Array.from(el.sheet.cssRules).forEach((rule) => {
                    if (rule.selectorText.indexOf(".") > -1) {
                        if (rule.selectorText.indexOf(",") <= 0 && rule.selectorText.indexOf(":") <= 0) {
                            if (rule.selectorText.split(".").length > 2) {
                               
                                rule.selectorText.split('.').forEach((el) => {
                                    if(/[a-z0-9]/i.test(el)){
                                        classesc.push(el);
                                    }
                                })
                            }else{
                                classesc.push(rule.selectorText.substring(1, rule.selectorText.length));
                            }

                            //console.log(rule.selectorText, "C");
                            
                        } else {
                            if (classesc.find((str) => str !== rule.selectorText.substring(1, rule.selectorText.length))) {
                                let Explode = rule.selectorText.split(",");
                                Explode.forEach((str) => {
                                    if (str.indexOf(":") <= 0) {
                                        //console.log(str, "A");
                                        classesc.push(this.Addons.replaceAll2(str.replace(/\s/g, ''), ".", ""));
                                        // classesc.push(str.substring(1, str.length));
                                        //console.log(str.substring(1, str.length), "A");
                                    } else {
                                        //console.log(str, "B");
                                        let Explode2 = str.replace(/\s/g, '').split(":");
                                        classesc.push(this.Addons.replaceAll2(Explode2[0], ".", ""));
                                        //console.log(Explode2[0].substring(1, Explode2[0].length), "B");
                                    }
                                    //console.log(Explode2, "xx")

                                });

                            }
                        }
                    }
                    // remove duplicate classes
                    classesc = classesc.filter((v, i, a) => a.indexOf(v) === i);
                    console.log(classesc)
                })
            });


            return classesc;



            //// get all classes
            //let classes = [];
            //for (let i = 0; i < css.length; i++) {
            //    let cssText = css[i].textContent;
            //    let cssTextArr = cssText.split("\n");
            //    for (let j = 0; j < cssTextArr.length; j++) {
            //        let cssTextLine = cssTextArr[j];
            //        if (cssTextLine.indexOf(".") > -1) {
            //            let cssTextLineArr = cssTextLine.split(".");
            //            let cssTextLineArrClass = cssTextLineArr[1].split("{");
            //            classes.push(cssTextLineArrClass[0]);
            //        }
            //    }
            //}
            //// remove classes contains ";"
            //let classesNew = [];
            //for (let i = 0; i < classes.length; i++) {
            //    if (classes[i].indexOf(";") == -1) {
            //        classesNew.push(classes[i].split(" ")[0]);
            //    }
            //}
            //
            //return classesNew;
        },

        Start: () => {
            const Classes = this.Css.Find();
            this.Css.ChangeNames(Classes);
        }
    }
}









