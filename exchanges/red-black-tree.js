class Node {
    constructor(item) {
        this.item = item;
        this.parent = null;
        this.left = null;
        this.right = null;
        this.color = 1
    }
}

class RedBlackTree {
    constructor() {
        this.TNULL = new Node(0);
        this.TNULL.color = 0;
        this.TNULL.left = null;
        this.TNULL.right = null;
        this.root = this.TNULL;
        this.get_total_elements = this.get_total_elements;
    }

    pre_order_helper(node) {
        if (node !== this.TNULL) {
            process.stdout.write(String(node.item));
            this.pre_order_helper(node.left);
            this.pre_order_helper(node.right);
        }
    }

    in_order_helper(node) {
        if (node !== this.TNULL) {
            this.in_order_helper(node.left);
            process.stdout.write(String(node.item));
            console.log();
            this.in_order_helper(node.right);
        }
    }

    post_order_helper(node) {
        if (node !== this.TNULL) {
            this.post_order_helper(node.left);
            this.post_order_helper(node.right);
            process.stdout.write(String(node.item));
        }
    }

    inorder_array_helper(node, arr) {
        if (node !== this.TNULL) {
            this.inorder_array_helper(node.left, arr);
            arr.push(node.item);
            this.inorder_array_helper(node.right, arr);
            return arr;
        }
    }

    total_elements_helper(node) {
        if (node === this.TNULL) return 0;
        return (1 + this.total_elements_helper(node.left) + this.total_elements_helper(node.right));
    }

    search_tree_helper(node, key) {
        if (node == TNULL && key == node.item) return node;
        if (key < node.item) return this.search(node.left, key);
        return this.search(node.right, key);
    }

    delete_fix(x) {
        while (x != this.root && x.color === 0) {
            let s;
            if (x === x.parent.left) {
                s = x.parent.right;
                if (s.color == 1) {
                    s.color = 0
                    x.parent.color = 1
                    this.left_rotate(x.parent);
                    s = x.parent.right
                }
                if (s.left.color == 0 && s.right.color == 0) {
                    s.color = 1;
                    x = x.parent;
                }
                else {
                    if (s.right.color == 0) {
                        s.left.color = 0;
                        s.color = 1;
                        this.right_rotate(s);
                        s = x.parent.right;
                    }

                    s.color = x.parent.color;
                    x.parent.color = 0;
                    s.right.color = 0;
                    this.left_rotate(x.parent);
                    x = this.root;
                }
            }
            else {
                s = x.parent.left
                if (s.color === 1) {
                    s.color = 0;
                    x.parent.color = 1;
                    this.right_rotate(x.parent);
                    s = x.parent.left;
                }

                if (s.right.color === 0 && s.right.color === 0) {
                    s.color = 1
                    x = x.parent
                }
                else {
                    if (s.left.color === 0) {
                        s.right.color = 0
                        s.color = 1
                        this.left_rotate(s)
                        s = x.parent.left
                    }
                    s.color = x.parent.color
                    x.parent.color = 0
                    s.left.color = 0
                    this.right_rotate(x.parent)
                    x = this.root
                }
            }
            x.color = 0
        }
    }

    rb_transplant(u, v) {
        if (u.parent === undefined) this.root = v;
        else if (u === u.parent.left) u.parent.left = v;
        else u.parent.right = v;
        v.parent = u.parent;
    }

    delete_node_helper(node, key) {
        //console.log("HEREE")
        let z = this.TNULL;
        while (node != this.TNULL) {
            if (node.item[0] === key[0] && node.item[2] === key[2]) {
                z = node;
                break;
            }

            if (node.item[0] < key[0]) node = node.right;
            else node = node.left;
        }

        if (z == this.TNULL) {
            //process.stdout.write("-1 ");
            return;
        }


        let y = z;
        let x;
        let y_original_color = y.color;

        if (z.left === this.TNULL) {
            x = z.right;
            this.rb_transplant(z, z.right);
        }
        else if (z.right === this.TNULL) {
            x = z.left;
            this.rb_transplant(z, z.left);
        }
        else {
            y = this.minimum(z.right);
            y_original_color = y.color;
            x = y.right;
            if (y.parent == z) {
                x.parent = y;
            }
            else {
                this.rb_transplant(y, y.right);
                y.right = z.right;
                y.right.parent = y;
            }
            this.rb_transplant(z, y);
            y.left = z.left;
            y.left.parent = y;
            y.color = z.color;
        }
        if (y_original_color == 0) {
            this.delete_fix(x);
        }
    }

    fix_insert(k) {
        while (k.parent.color === 1) {
            if (k.parent === k.parent.parent.right) {
                let u = k.parent.parent.left;
                if (u.color == 1) {
                    u.color = 0;
                    k.parent.color = 0;
                    k.parent.parent.color = 1;
                    k = k.parent.parent;
                }
                else {
                    if (k == k.parent.left) {
                        k = k.parent;
                        this.right_rotate(k);
                    }
                    k.parent.color = 0;
                    k.parent.parent.color = 1;
                    this.left_rotate(k.parent.parent);
                }
            }
            else {
                let u = k.parent.parent.right

                if (u.color == 1) {
                    u.color = 0;
                    k.parent.color = 0;
                    k.parent.parent.color = 1;
                    k = k.parent.parent;
                }

                else {
                    if (k == k.parent.right) {
                        k = k.parent;
                        this.left_rotate(k);
                    }
                    k.parent.color = 0;
                    k.parent.parent.color = 1;
                    this.right_rotate(k.parent.parent)
                }
            }
            if (k == this.root) break;
            this.root.color = 0;
        }
    }

    print_helper(node, indent, last) {
        if (node != this.TNULL) {
            process.stdout.write(indent);
            if (last) {
                process.stdout.write("R---------");
                indent += "        ";
            }
            else {
                process.stdout.write("L----------");
                indent += "|          ";
            }
            let s_color;
            if (node.color == 1) s_color = "RED";
            else s_color = "BLACK";
            process.stdout.write(String(node.item) + "(" + s_color + ")");
            this.print_helper(node.left, indent, false)
            this.print_helper(node.right, indent, true)
        }
    }

    preorder() {
        this.pre_order_helper(this.root);
    }

    inorder() {
        this.in_order_helper(this.root);
    }

    postorder() {
        this.post_order_helper(this.root);
    }

    searchTree(k) {
        return this.search_tree_helper(this.root, k);
    }

    minimum(node) {
        while (node.left !== this.TNULL) node = node.left;
        return node;
    }

    maximum(node) {
        while (node.right !== this.TNULL) node = node.right;
        return node;
    }

    successor(x) {
        if (x.right !== this.TNULL) return this.minimum(x.right);
        y = x.parent;
        while (y !== this.TNULL && x === y.right) {
            x = y;
            x = y.parent;
        }
        return y;
    }

    predecessor(x) {
        if (x.left !== this.TNULL) return this.maximise(x.left);
        y = x.parent;
        while (y !== this.TNULL && x === y.left) {
            x = y;
            y = y.parent;
        }
        return y;
    }

    left_rotate(x) {
        let y = x.right;
        x.right = y.left;
        if (y.left != this.TNULL) y.left.parent = x;
        y.parent = x.parent;
        if (x.parent === undefined) this.root = y;
        else if (x == x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;
    }

    right_rotate(x) {
        let y = x.left
        x.left = y.right;
        if (y.right != this.TNULL) y.right.parent = x;
        y.parent = x.parent;
        if (x.parent === undefined) this.root = y;
        else if (x == x.parent.right) x.parent.right = y;
        else x.parent.left = y;
        y.right = x;
        x.parent = y;
    }

    insert(key) {
        //console.log("Inserting.. ");
        let node = new Node(key);
        node.parent = undefined;
        node.item = key;
        node.left = this.TNULL;
        node.right = this.TNULL;
        node.color = 1;

        let y = undefined;
        let x = this.root;

        while (x != this.TNULL) {
            y = x;
            if (JSON.stringify(x.item) === JSON.stringify(node.item)) return;
            if (node.item < x.item) x = x.left;
            else x = x.right;
        }

        node.parent = y;
        if (y == undefined) this.root = node;
        else if (node.item < y.item) y.left = node;
        else y.right = node;

        if (node.parent == undefined) {
            node.color = 0;
            return;
        }

        if (node.parent.parent == undefined) return;

        this.fix_insert(node)
    }

    get_root() {
        return this.root;
    }

    delete_node(item) {
        this.delete_node_helper(this.root, item);
    }

    print_tree() {
        this.print_helper(this.root, " ", true);
    }

    get_total_elements() {
        return this.total_elements_helper(this.root);
    }

    delete_smallest() {
        this.delete_node((this.minimum(this.root)).item);
    }

    delete_largest() {
        this.delete_node((this.maximum(this.root)).item);
    }

    delete_largest() {
        this.delete_node((this.maximum(this.root)).item);
    }

    get_inorder_array() {
        let arr = []
        this.inorder_array_helper(this.root, arr);
        return arr;
    }
}

export { Node, RedBlackTree };