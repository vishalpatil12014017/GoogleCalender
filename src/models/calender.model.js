module.exports = (sequelize, Sequelize) => {
  const calender = sequelize.define("calender_service", {
    googleid: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    htmlLink: {
      type: Sequelize.STRING,
    },
    summary: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    startDateTime: {
      type: Sequelize.STRING,
    },
    endDateTime: {
      type: Sequelize.STRING,
    },
    hangoutLink: {
      type: Sequelize.STRING,
    },
    createrEmail: {
      type: Sequelize.STRING,
    },
    guestEmail: {
      type: Sequelize.JSON,
    }
  });

  return calender;
};
