const express = require("express");
const router = express.Router();

const NbaPlayer = require("../models/nbaPlayers.model");

//MIDLEWARE

const getPlayer = async (req, res, next) => {
  let nbaPlayer;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El id no es valido",
    });
  }

  try {
    nbaPlayer = await NbaPlayer.findById(id);

    if (!nbaPlayer) {
      return res.status(404).json({
        message: "El jugador no fue encontrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  res.nbaPlayer = nbaPlayer;
  next();
};

//GET ALL
router.get("/", async (req, res) => {
  try {
    const nbaPlayers = await NbaPlayer.find();
    if (nbaPlayers.length === 0) {
      return res.status(204).json([]);
    }
    res.json(nbaPlayers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST

router.post("/", async (req, res) => {
  const { name, team, nationalTeam } = req?.body;

  if (!name || !team || !nationalTeam) {
    return res.status(400).json({ message: "Error" });
  }

  const nbaPlayer = new NbaPlayer({
    name,
    team,
    nationalTeam,
  });

  try {
    const newNbaPlayer = await nbaPlayer.save();
    res.status(201).json(newNbaPlayer);
  } catch (error) {
    res.status(400).json({ message: "error en conseguir la madre esa" });
  }
});

router.get("/:id", getPlayer, async (req, res) => {
  res.json(res.nbaPlayer);
});

router.put("/:id", getPlayer, async (req, res) => {
  try {
    const nbaPlayer = res.nbaPlayer;
    nbaPlayer.name = req.body.name || nbaPlayer.name;
    nbaPlayer.team = req.body.team || nbaPlayer.team;
    nbaPlayer.nationalTeam = req.body.nationalTeam || nbaPlayer.nationalTeam;

    const updatedNbaPlayer = await nbaPlayer.save();
    res.json(updatedNbaPlayer);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.patch("/:id", getPlayer, async (req, res) => {
  if (!req.body.name && !req.body.nationalTeam && !req.body.team) {
    res.status(400).json({
      message:
        "Al menos uno de estos campos debe estar: name, nationalTeam o team",
    });
  }

  try {
    const nbaPlayer = res.nbaPlayer;
    nbaPlayer.name = req.body.name || nbaPlayer.name;
    nbaPlayer.team = req.body.team || nbaPlayer.team;
    nbaPlayer.nationalTeam = req.body.nationalTeam || nbaPlayer.nationalTeam;

    const updatedNbaPlayer = await nbaPlayer.save();
    res.json(updatedNbaPlayer);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.delete("/:id", getPlayer, async (req, res) => {
  try {
    const nbaPlayer = res.nbaPlayer;
    await nbaPlayer.deleteOne({
      _id: nbaPlayer._id,
    });
    res.json({
      message: `El jugador fue eliminado ${nbaPlayer.name} correctamente`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
