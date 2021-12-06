const {getTags, getTag, postTag, putTag, deleteTag} = require('../controllers/tags.controller');
const assert = require('assert');

describe('tags', function() {
    it('How many parameter wait getTags function', function() {
        assert.strictEqual(getTags.length, 2);
    });
    it('How many parameter wait getTag function', function() {
        assert.strictEqual(getTag.length, 2);
    });
    it('How many parameter wait postTag function', function() {
        assert.strictEqual(postTag.length, 2);
    });
    it('How many parameter wait putTag function', function() {
        assert.strictEqual(putTag.length, 2);
    });
    it('How many parameter wait deleteTag function', function() {
        assert.strictEqual(deleteTag.length, 2);
    });
    
});