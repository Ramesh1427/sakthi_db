// Every simple manageable section: API path + form fields.
export const SECTIONS = {
  courses: { label: 'Courses', path: 'courses', title: 'name', fields: [
    { name: 'category', label: 'Category', type: 'text', required: true },
    { name: 'name', label: 'Course name', type: 'text', required: true },
    { name: 'description', label: 'Short description', type: 'textarea', rows: 3 },
    { name: 'tags', label: 'Tags', type: 'text', help: 'Comma separated' },
  ] },
  videos: { label: 'Demo videos', path: 'videos', title: 'title', fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'youtube_url', label: 'YouTube link', type: 'url', required: true },
    { name: 'description', label: 'Description', type: 'text' },
  ] },
  technologies: { label: 'Technologies', path: 'technologies', title: 'name', fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, help: 'For example PostgreSQL, Oracle, MySQL' },
    { name: 'order', label: 'Order', type: 'number', default: 0, help: 'Smaller numbers come first. The first one is the default tab.' },
  ] },
  labs: { label: 'Labs', path: 'labs', title: 'title', fields: [
    { name: 'technology', label: 'Technology', type: 'select', optionsFrom: 'technologies', required: true, help: 'Which tab it appears under on the website' },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
  ] },
  interview: { label: 'Interview Q&A', path: 'interview-questions', title: 'question', fields: [
    { name: 'technology', label: 'Technology', type: 'select', optionsFrom: 'technologies', required: true, help: 'Which tab it appears under on the website' },
    { name: 'question', label: 'Question', type: 'text', required: true },
    { name: 'answer', label: 'Answer', type: 'textarea', rows: 6, required: true },
  ] },
  blogs: { label: 'Blogs', path: 'blogs', title: 'title', fields: [
    { name: 'technology', label: 'Technology', type: 'select', optionsFrom: 'technologies', required: true, help: 'Which tab it appears under on the website' },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'textarea', rows: 10, required: true },
  ] },
  slides: { label: 'Hero slides', path: 'hero-slides', title: 'title', fields: [
    { name: 'title', label: 'Headline', type: 'text', required: true },
    { name: 'text', label: 'Short text', type: 'text' },
    { name: 'button_text', label: 'Button text', type: 'text', default: 'View courses' },
    { name: 'button_link', label: 'Button link', type: 'text', default: '#courses', help: 'For example #courses, #videos, #labs, #contact' },
    { name: 'art', label: 'Illustration', type: 'select', default: 'db', options: [['db', 'Database'], ['code', 'Code editor'], ['terminal', 'Terminal']] },
    { name: 'order', label: 'Order', type: 'number', default: 0, help: 'Smaller numbers come first' },
    { name: 'is_active', label: 'Show on website', type: 'checkbox', default: true },
  ] },
}
