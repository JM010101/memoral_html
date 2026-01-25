from diffusers import StableDiffusionImg2ImgPipeline, DPMSolverMultistepScheduler
from PIL import Image
import sys

p = StableDiffusionImg2ImgPipeline.from_pretrained("./models", local_files_only=True, safety_checker=None, requires_safety_checker=False)
p.enable_model_cpu_offload()
p.scheduler = DPMSolverMultistepScheduler.from_config(p.scheduler.config, use_karras_sigmas=True)

img = Image.open(sys.argv[1]).convert("RGB")
pr = sys.argv[2]
p(pr + ", same face, same pose, same person, keep face unchanged", image=img, strength=0.35, num_inference_steps=28, guidance_scale=6.5).images[0].save("output.png")
