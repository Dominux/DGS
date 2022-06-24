pub struct Section {
    pub name: String,
    pub content: String,
}

impl Section {
    pub fn new(name: String, content: String) -> Self {
        Self { name, content }
    }
}
