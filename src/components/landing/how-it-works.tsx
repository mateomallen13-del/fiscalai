export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Renseignez les informations",
      description:
        "Saisissez le chiffre d'affaires, les charges et la rémunération souhaitée du dirigeant.",
    },
    {
      number: "2",
      title: "Comparez les scénarios",
      description:
        "Visualisez instantanément la comparaison TNS vs assimilé salarié avec tous les détails.",
    },
    {
      number: "3",
      title: "Exportez le rapport",
      description:
        "Générez un PDF professionnel à remettre à votre client en fin de rendez-vous.",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Simple comme 1, 2, 3
          </h2>
          <p className="mt-4 text-muted-foreground">
            Un processus fluide pour des résultats immédiats.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
