"""Load the demo content the old Node project shipped with (seed_db.ts plus the
demo projects/blogs its API returned when those tables were empty).

Only fills tables that are empty, so it is safe to run repeatedly. It does not
create an admin user: use `manage.py createsuperuser`.
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import (
    Blog,
    Certificate,
    Course,
    Education,
    Experience,
    Project,
    Skill,
    SiteSettings,
    WhatIDo,
)

U = "https://images.unsplash.com"

DEMO = [
    (Course, [
        dict(title="React Masterclass", description="Learn React from zero to hero.",
             image_url=f"{U}/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"),
        dict(title="Full Stack Next.js", description="Build full stack apps with Next.js, Prisma, and PostgreSQL.",
             image_url=f"{U}/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80"),
    ]),
    (Experience, [
        dict(company="TechNova Inc.", role="Senior Software Engineer", start_date="2021", end_date="Present",
             description="Lead developer for the core platform. Architected the transition to microservices."),
        dict(company="EduSpark", role="Software Engineer", start_date="2018", end_date="2021",
             description="Developed interactive educational tools using React and Node.js."),
    ]),
    (Education, [
        dict(institution="University of Technology", degree="BSc Computer Science", start_date="2014",
             end_date="2018", description="Graduated with honors. Specialized in distributed systems."),
    ]),
    (Skill, [
        dict(name="React", category="Frontend", proficiency=95),
        dict(name="TypeScript", category="Languages", proficiency=90),
        dict(name="Node.js", category="Backend", proficiency=85),
        dict(name="PostgreSQL", category="Database", proficiency=80),
    ]),
    (Certificate, [
        dict(name="AWS Certified Solutions Architect", issuer="Amazon Web Services", date="2022"),
    ]),
    (Project, [
        dict(title="EduIgnite School Management System", category="Full Stack", featured=True,
             description="A comprehensive platform for school administration, integrating robust backend services with an intuitive frontend.",
             technologies="React, Node.js, PostgreSQL, Tailwind CSS",
             image_url=f"{U}/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"),
        dict(title="ELIGNITE Corporate Platform", category="Web App", featured=True,
             description="Corporate website and client portal for ELIGNITE, featuring a custom CMS and real-time client communication.",
             technologies="Next.js, Prisma, TypeScript",
             image_url=f"{U}/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"),
        dict(title="Mathematics Learning Hub", category="EdTech",
             description="Interactive mathematics learning platform with algorithmic problem generation and progress tracking.",
             technologies="React, Express, MongoDB",
             image_url=f"{U}/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"),
    ]),
    (Blog, [
        dict(title="Building Scalable Architecture with Next.js", slug="scalable-nextjs", category="Engineering",
             tags="Next.js, Architecture", reading_time=5,
             content="Learn how to leverage Next.js App Router and Server Components to build highly scalable and performant web applications.",
             cover_image=f"{U}/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"),
        dict(title="The Mathematics of Clean Code", slug="math-clean-code", category="Philosophy",
             tags="Clean Code, Math", reading_time=8,
             content="Clean code is like an elegant equation. Discover the hidden mathematical principles behind clean code, algorithmic efficiency, and scalable software design.",
             cover_image=f"{U}/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"),
    ]),
    (WhatIDo, [
        dict(title="Frontend", icon="Globe", items="React, Next.js, TypeScript, Tailwind CSS"),
        dict(title="Backend", icon="Terminal", items="Python, Django, REST APIs, PostgreSQL"),
        dict(title="Cloud & Architecture", icon="Database", items="AWS, Vercel, Docker, System Design"),
    ]),
]


class Command(BaseCommand):
    help = "Load demo content into empty tables."

    @transaction.atomic
    def handle(self, *args, **options):
        SiteSettings.load()
        for model, rows in DEMO:
            name = model._meta.verbose_name_plural
            if model.objects.exists():
                self.stdout.write(f"{name}: already has data, skipped")
                continue
            model.objects.bulk_create([model(**row) for row in rows])
            self.stdout.write(self.style.SUCCESS(f"{name}: added {len(rows)}"))
