const test = require('node:test');
const assert = require('node:assert/strict');

const Words = require('../models/words.model');
const { editWords } = require('../controllers/words.controller');

const originalFindOneAndUpdate = Words.findOneAndUpdate;

test('editWords keeps learned status when updating a word', async () => {
  let captured = null;
  const id = '0123456789abcdef01234567';

  Words.findOneAndUpdate = (filter, update, options) => {
    captured = { filter, update, options };
    return {
      select() {
        return this;
      },
      async lean() {
        return { _id: id, word: 'hello', learned: true };
      }
    };
  };

  const req = {
    params: { id },
    user: { _id: 'user123' },
    body: { learned: true }
  };

  const res = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    }
  };

  await editWords(req, res);

  assert.deepEqual(captured.update, {
    learned: true
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.word.learned, true);

  Words.findOneAndUpdate = originalFindOneAndUpdate;
});
