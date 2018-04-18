(function () {

    function copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    var vm = null;

    Vue.component('todo-item', {
        props: [
            'item'
        ],
        template: `
            <div class="todo-item">
                
                <span v-if="!isEditing" class="todo-item-title" @click="onEnableEdition">
                    {{ title }}
                </span>
                
                <span v-if="isEditing" class="todo-item-title">
                    <input ref="input" v-model="tempTitle" @keydown.enter="onSaveEdition" @blur="onBlur" />
                </span>

                <div class="todo-item-action">
                    <button @click="onDone">Done</button>
                </div>
            </div>
        `,
        mounted: function () {
            console.log(this)
        },
        data: function () {
            return {
                isEditing: false,
                newItem: {
                    id: this.item.id,
                    title: this.item.title
                },

                tempTitle: '',
            }
        },
        computed: {
            id: function () {
                return this.item.id;
            },
            title: {
                get: function () {
                    return this.newItem.title;
                },
                set: function (title) {
                    this.newItem = {
                        id: this.id,
                        title: title
                    };
                }
            }
        },
        methods: {
            onDone: function () {
                this.$emit('done', this.data);
            },
            onEnableEdition: function () {
                this.isEditing = true;
                this.tempTitle = this.title;

                setTimeout(function () {
                    this.$refs.input.focus();
                }.bind(this), 25);
            },
            onBlur: function () {
                this.isEditing = false;
                this.tempTitle = '';
            },
            onSaveEdition: function () {
                this.title = this.tempTitle;

                this.$emit('edit', {
                    id: this.id,
                    title: this.title
                });

                this.isEditing = false;
            }
        }
    });

    Vue.component('todo-list', {
        props: [
            'items'
        ],
        template: `
            <div class="todo-list">
                <todo-item 
                    v-for="item in items"
                    :key="item.id" 
                    :item="item"
                    @done="onDone"
                    @edit="onEdit">
                </todo-item>
            </div>
        `,
        methods: {
            onDone: function (item) {
                this.remoteItem(item);
            },
            onEdit: function (newItem) {
                var index = this.items.findIndex(_ => _.id === newItem.id);
                this.items.splice(index, 1, newItem);
            },
            remoteItem: function (item) {
                this.items.splice(this.items.indexOf(item), 1);
            }
        }
    });

    Vue.component('todo-input', {
        template: `
            <div class="todo-input">
                <input type="text" v-model="text" @keydown.enter="onSubmit" placeholder="Adicione uma tarefa" />
            </div>
        `,

        data: function () {
            return {
                text: ''
            }
        },

        methods: {
            onSubmit: function () {
                if (!this.text) {
                    return;
                }

                this.$emit('submit', { id: new Date().getTime(), title: this.text });
                this.clearText();
            },
            clearText: function () {
                this.text = ''
            }
        }

    });

    vm = new Vue({
        el: '#app',

        data: {
            todoList: []
        },

        methods: {
            onSubmit: function (newItem) {
                this.todoList.push(newItem);
            }
        }
    });

})();
