let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');

const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const CommentModel = require('../models/Comment');

async function findPost() {
  const post = await PostModel.findOne();
  // console.log(post._id.toString());
  return post._id.toString();
}

let postId = 0;
findPost().then((data) => {
  postId = data;
});

chai.should();
chai.use(chaiHttp);

describe('Find all posts', () => {
  it('It should find all posts', (done) => {
    chai
      .request(server)
      .get('/forums')
      .end((err, res) => {
        // console.log(res.body);
        res.body.should.be.a('array');
        done();
      });
  });
});

describe('Creating a new post', () => {
  it('It should create a new post', (done) => {
    let name = 'Test-portfolio';
    let description = 'sample text for making a post.';
    chai
      .request(server)
      .post('/')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ name, description })
      .end((err, res) => {
        // console.log(res.body);
        res.body.should.have.property('name');
        res.body.should.have.property('description');
        done();
      });
  });
});

describe('Deleting a post', () => {
  it('It should delete an existing post', (done) => {
    chai
      .request(server)
      .delete('/' + postId)
      .end((err, res) => {
        // console.log('/portfolio/' + userId + '/' + portfolioId);
        // console.log(res.body);
        res.should.have.status(200);
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        done();
      });
  });

  it('It should delete an existing post', (done) => {
    chai
      .request(server)
      .delete('/' + 0)
      .end((err, res) => {
        // console.log('/portfolio/' + userId + '/' + portfolioId);
        res.should.have.status(404);
        res.text.should.be.eq('Failed to delete');
        // console.log(res);
        done();
      });
  });
});

describe('Correct details to view a specific post', () => {
  it('It should get the post by id', (done) => {
    chai
      .request(server)
      .get('/forums/' + postId)
      .end((err, res) => {
        res.body.should.have.property('_id');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('comments');
        res.body.should.have.property('likeCount');
        res.body.should.have.property('dislikeCount');
        done();
      });
  });
});
