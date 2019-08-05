let Candidate = require("../models/candidates.model");

const postSlack = require("./postSlack");

// function to store candidates depending on the problem encountered in mongodb database
const saveCandidate = (pb, id, name, res) => {
  const date = new Date();

  // checks if the candidateID already exists
  Candidate.findOne({ candidateId: id })
    .then(candidate => {
      if (!candidate) {
        const candidate = new Candidate({
          candidateId: id,
          candidatetName: name,
          problem: pb,
          date:
            date.getDate() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getFullYear()
        });

        candidate.save((err, candidate) => {
          if (err)
            return console.log(
              `error: couldn't save candidate to database. Id: ${id}, Name: ${name}`
            );
          postSlack(id, name, pb);
          console.log(
            `Id: ${id}, Name: ${name} saved to the database. Issue: ${pb}`
          );
          res.json({
            saveCandidate: {
              update: false,
              smsFail: {
                id: `${id}`,
                to: `${name}`,
                issue: `${pb}`
              }
            }
          });
        });
      } else {
        // updating if candidate exists
        const date = new Date();

        Candidate.findOneAndUpdate(
          { candidateId: id },
          {
            problem: pb,
            date:
              date.getDate() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getFullYear()
          },
          { upsert: true, useFindAndModify: false },
          (err, doc) => {
            if (err) {
              console.log(
                `error: couldn't find and update candidate in database. Id: ${id}, Name: ${name}`
              );
              return res.status(500).json({
                success: false,
                error: `couldn't find and update candidate in database. Id: ${id}, Name: ${name}`
              });
            }
            postSlack(id, name, pb);

            console.log(
              `Id: ${id}, Name: ${name} saved (update) to the database. Issue: ${pb}`
            );

            res.json({
              saveCandidate: {
                update: true,
                smsFail: {
                  id: `${id}`,
                  to: `${name}`,
                  issue: `${pb}`
                }
              }
            });
          }
        );
      }
    })
    .catch(err => {
      console.log(`error: couldn't interact with database`);
      res.status(500).json({
        success: false,
        error: `couldn't interact with database`
      });
    });
};

module.exports = saveCandidate;
