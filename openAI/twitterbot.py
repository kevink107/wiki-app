import openai

openai.api_key = ("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")

response = openai.Completion.create(
  engine="text-curie-001",
  prompt="What are the key points from this text:\n\n\"\"\"\nA nuclear weapon (also known as an atom bomb, atomic bomb, nuclear bomb or nuclear warhead, and colloquially as an A-bomb or nuke) is an explosive device that derives its destructive force from nuclear reactions, either fission (fission bomb) or a combination of fission and fusion reactions (thermonuclear bomb). Both bomb types release large quantities of energy from relatively small amounts of matter. The first test of a fission (atomic) bomb released an amount of energy approximately equal to 20,000 tons of TNT (84 TJ).[1] The first thermonuclear (hydrogen) bomb test released energy approximately equal to 10 million tons of TNT (42 PJ). Nuclear bombs have had yields between 10 tons TNT (the W54) and 50 megatons for the Tsar Bomba (see TNT equivalent). A thermonuclear weapon weighing as little as 600 pounds (270 kg) can release energy equal to more than 1.2 megatonnes of TNT (5.0 PJ).[2] A nuclear device no larger than a conventional bomb can devastate an entire city by blast, fire, and radiation. Since they are weapons of mass destruction, the proliferation of nuclear weapons is a focus of international relations policy. Nuclear weapons have been deployed twice in war, by the United States against the Japanese cities of Hiroshima and Nagasaki in 1945 during World War II.\n\"\"\"\n\nThe key points are:\n\n1.",
  temperature=0.5,
  max_tokens=50,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0,
  stop=["\"\"\""]
)

print(response)