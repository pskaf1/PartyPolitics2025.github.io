const path = require('path');
const DebateRequest = require(path.join(__dirname, 'models', 'DebateRequest'));
const DebateTopic = require(path.join(__dirname, 'models', 'DebateTopic'));
const sendEmail = require('./utils/sendEmail');

const selectDebateParticipants = async () => {
  try {
    const topics = await DebateTopic.find({ debateDate: { $gt: new Date() } });
    for (const topic of topics) {
      const proRequests = await DebateRequest.find({ topicId: topic._id, side: 'pro', status: 'pending' });
      const conRequests = await DebateRequest.find({ topicId: topic._id, side: 'con', status: 'pending' });

      const selectedPro = proRequests.length > 0 ? proRequests[Math.floor(Math.random() * proRequests.length)] : null;
      const selectedCon = conRequests.length > 0 ? conRequests[Math.floor(Math.random() * conRequests.length)] : null;

      if (selectedPro && selectedCon) {
        selectedPro.status = 'selected';
        selectedCon.status = 'selected';
        await selectedPro.save();
        await selectedCon.save();

        const debateDateFormatted = topic.debateDate.toLocaleString();
        const subject = 'You have been selected for the upcoming debate!';
        const proMessage = `You've been selected to debate "${topic.title}" as Pro on ${debateDateFormatted}.`;
        const conMessage = `You've been selected to debate "${topic.title}" as Con on ${debateDateFormatted}.`;

        await sendEmail(selectedPro.userId, subject, proMessage);
        await sendEmail(selectedCon.userId, subject, conMessage);
        console.log(`Notifications sent for topic: "${topic.title}"`);
      } else {
        console.log(`Not enough participants for topic: "${topic.title}"`);
      }
    }
  } catch (error) {
    console.error('Error selecting participants for debate:', error);
  }
};

module.exports = selectDebateParticipants;
